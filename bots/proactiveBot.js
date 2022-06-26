// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, TurnContext, TeamsActivityHandler, TeamsInfo, MessageFactory } = require('botbuilder');

const tableStore = require('azure-storage');

const { TaskModuleResponseFactory } = require('../models/taskmoduleresponsefactory');
const { TaskModuleUIConstants } = require('../models/taskModuleUIConstants');
const { SingleTaskModuleUI } = require('../models/singleTaskModuleUI');
const { TaskModuleIds } = require('../models/taskmoduleids');

const authStore = require('../keys');
const authObject = new authStore();

const tableClient = tableStore.createTableService(authObject.accountName, authObject.accessKey);

// Read botFilePath and botFileSecret from .env file.
const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

class ProactiveBot extends TeamsActivityHandler {
    constructor(conversationReferences) {
        super();

        this.baseUrl = process.env.BaseUrlTest;

        this.conversationReferences = conversationReferences;

        // this.onConversationUpdate(async (context, next) => {
        //     this.addConversationReference(context.activity);

        //     await next();
        // });

        // get channel details when Bot is added newly
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id === context.activity.recipient.id) {
                    this.addConversationReference(context.activity);
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            this.addConversationReference(context.activity);

            // Introduce the Bot
            await context.sendActivity(`Hi, I'm the GA Turnaround Notification Bot!`);
            await next();
        });
    };

    async handleTeamsTaskModuleFetch(context, taskModuleRequest) {
        // Called when the user selects an options from the displayed HeroCard or
        // AdaptiveCard.  The result is the action to perform.

        const cardTaskFetchValue = taskModuleRequest.data.data;
        const flightNumber = taskModuleRequest.data.flightNumber;
        const rowKey = taskModuleRequest.data.rowKey;
        const taskRowKey = taskModuleRequest.data.taskRowKey;
        var taskInfo = {}; // TaskModuleTaskInfo
        // console.log(cardTaskFetchValue);
    
        if (cardTaskFetchValue === TaskModuleIds.UpdateTask) {
            taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.UpdateTask + '.html?flightNumber='+flightNumber+'&rowKey='+rowKey;
            this.setTaskInfo(taskInfo, TaskModuleUIConstants.UpdateTask);
            
        } else if (cardTaskFetchValue === TaskModuleIds.ViewActivity) {
            taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.ViewActivity + '.html?flightNumber='+flightNumber+'&rowKey='+rowKey;
            this.setTaskInfo(taskInfo, TaskModuleUIConstants.ViewActivity);
        } else if (cardTaskFetchValue === TaskModuleIds.Notify) {
            // await this.messageAllMembersAsync(context, flightNumber);
            taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.Notify + '.html?flightNumber='+flightNumber+'&rowKey='+rowKey;
            this.setTaskInfo(taskInfo, TaskModuleUIConstants.Notify);
        } else if (cardTaskFetchValue === TaskModuleIds.SingleUpdate) {
            taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.SingleUpdate + '.html?flightNumber='+flightNumber+'&taskRowKey='+taskRowKey;
            this.setTaskInfo(taskInfo, SingleTaskModuleUI.SingleUpdate);
        }else if (cardTaskFetchValue === TaskModuleIds.MarkDone) {
            var resp = await this.checkUpdateTask(context, flightNumber, taskRowKey); 
            taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + TaskModuleIds.MarkDone + '.html?flightNumber='+flightNumber+'&success='+resp.success+'&taskTitle='+resp.taskTitle+'&message='+resp.message;
            this.setTaskInfo(taskInfo, SingleTaskModuleUI.MarkDone);
        }
    
        return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo);
    }

    async handleTeamsTaskModuleSubmit(context, taskModuleRequest) {
        // Called when data is being returned from the selected option (see `handleTeamsTaskModuleFetch').

        // Echo the users input back.  In a production bot, this is where you'd add behavior in
        // response to the input.
        await context.sendActivity(MessageFactory.text('handleTeamsTaskModuleSubmit: ' + JSON.stringify(taskModuleRequest.data)));

        // Return TaskModuleResponse
        return {
            // TaskModuleMessageResponse
            task: {
                type: 'message',
                value: 'Thanks!'
            }
        };
    }
    
    async checkUpdateTask(context, flightNumber, taskRowKey) {
        return new Promise( async(resolve, reject) => {
            const task = await this.getTaskByRowKey(taskRowKey);
            const respData = {
                success: false,
                message: 'You are not part of this airport team',
                taskTitle: task.Task
            };
            const conversationReference = TurnContext.getConversationReference(context.activity);
            const currentUserID = conversationReference.user.aadObjectId; //TeamsID in DB

            if (task.Status == "Done") {
                respData.message = task.Task+' has already been marked as "Done" by '+task.DoneBy+" at "+this.convertTo24Hrs(task.Timestamp);
            }else{
                const teamMembers =  await this.getTeamMembersFromDB(flightNumber, task);
                var teamMember = teamMembers.find(member => member.TeamsID == currentUserID);
                console.log(teamMembers);
                console.log(teamMember);
                console.log(currentUserID);

                if (teamMember != undefined) {
                    if (teamMember.Role == task.Role || teamMember.Role == 'Duty Manager' || task.Role == 'All') {
                        var success = await this.markTaskAsDone(task, flightNumber, conversationReference.user.name);
                        if (success == true) {
                            respData.success = 'yes';
                            respData.message = task.Task+' successfully marked as done';
                        }else{
                            respData.success = success;
                            respData.message = 'Unable to mark task as done';
                        }
                    }else{
                        respData.message = task.Task+' can only be completed by a '+task.Role;
                    }
                }
            }
            resolve(respData);
        });
    }

    async getTeamMembersFromDB(flightNumber, task)
    {
        return new Promise((resolve, reject) => {
            var query = new tableStore.TableQuery()
                .where('FlightNumber eq ?', flightNumber);
            tableClient.queryEntities('Flights', query, null, async (error, result, resp) => {
                if (error) {
                    reject(error.message);
                } else {
                    var location_short = resp.body.value[0].Destination;
                    if (task.Category == 'Post Departure') {
                        location_short = resp.body.value[0].Origin;
                    }
                    var team = await this.getTeam(location_short);
                    var teamUsers = await this.getUsers(team.Location);
                    resolve(teamUsers);
                }
            });
        });
    }

    async getUsers(partitionKey)
    {
        return new Promise((resolve, reject) => {
            var query = new tableStore.TableQuery()
                .where('PartitionKey eq ?', partitionKey);
            tableClient.queryEntities('Users', query, null, (error, result, resp) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(resp.body.value);
                }
            });
        });
    }

    async getTeam(location_short)
    {
        var query = new tableStore.TableQuery()
            .where('LocationShort eq ?', location_short);
        return new Promise((resolve, reject) => {
            tableClient.queryEntities('AirportTeams', query, null, (error, result, resp) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(resp.body.value[0]);
                }
            });
        });
    }

    async getTaskByRowKey(rowKey)
    {
        return new Promise((resolve, reject) => {
            var query = new tableStore.TableQuery()
                .where('RowKey eq ?', rowKey);
            tableClient.queryEntities('DailyTasks', query, null, (error, result, resp) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(resp.body.value[0]);
                }
            });
        });
    }

    async markTaskAsDone(task, flightNumber, doneBy)
    {
        console.log("here");
        return new Promise((resolve, reject) => {
            let data = {
                PartitionKey: flightNumber,
                RowKey: task.RowKey,
                Task: task.Task,
                DoneBy: doneBy,
                Comment: 'None',
                Status: "Done",
            }
            tableClient.replaceEntity('DailyTasks', data, (error, result) => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async getChannelMembers(context) {
        let continuationToken;
        const members = [];

        do {
            const page = await TeamsInfo.getPagedMembers(
                context,
                100,
                continuationToken
            );

            continuationToken = page.continuationToken;

            members.push(...page.members);
        } while (continuationToken !== undefined);

        return members;
    }

    convertTo24Hrs(dateStr) {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hourCycle: 'h23',
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    setTaskInfo(taskInfo, uiSettings) {
        taskInfo.height = uiSettings.height;
        taskInfo.width = uiSettings.width;
        taskInfo.title = uiSettings.title;
    }

    addConversationReference(activity) {
        const ConvoReferencesTable = "ConvoReferences";
        const tableClient = tableStore.createTableService(process.env.AccountName, process.env.AccessKey);

        const conversationReference = TurnContext.getConversationReference(activity);
        // console.log(conversationReference.conversation.id);

        var query = new tableStore.TableQuery()
                .where('PartitionKey eq ?', conversationReference.conversation.id);
            tableClient.queryEntities(ConvoReferencesTable, query, null, (error, result, resp) => {
                if (error) {
                    console.log(error);
                } else {
                    if (resp.body.value[0] == undefined) {
                        let convoRef = {
                            PartitionKey: conversationReference.conversation.id, // Actual Channel ID
                            RowKey: conversationReference.channelId, // name of the host application (msteams, webchat etc)
                            convoRefJson: JSON.stringify(conversationReference),
                        }
                        tableClient.insertEntity(ConvoReferencesTable, convoRef, (error, result) => {
                            if (error) {
                                console.log(error)
                            }
                        });
                    }
                }
            });

        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }
}

module.exports.ProactiveBot = ProactiveBot;
