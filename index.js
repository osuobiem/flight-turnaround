// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// index.js is used to setup and configure your bot

// Import required pckages
const path = require('path');

// Read botFilePath and botFileSecret from .env file.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const restify = require('restify');

const tableStore = require('azure-storage');

const { v4: uuidv4 } = require('uuid');

const { Parser } = require('json2csv');
const fs = require('fs');

const authStore = require('./keys');
const authObject = new authStore();

var axios = require('axios');

const cron = require('node-cron');


// API Routes
const routes = require('./routes/api');

// Web App Routes
const webRoutes = require('./routes/web');

const {
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory,
    createBotFrameworkAuthenticationFromConfiguration,
    MessageFactory,
    CardFactory
} = require('botbuilder');
const { TaskModuleUIConstants } = require('./models/taskModuleUIConstants');
const { SingleTaskModuleUI } = require('./models/singleTaskModuleUI');
const { TaskModuleIds } = require('./models/taskmoduleids');
const { TaskModuleResponseFactory } = require('./models/taskmoduleresponsefactory');
const { TeamsTaskModuleBot } = require('./bots/teamsTaskModuleBot');
const { ProactiveBot } = require('./bots/proactiveBot');

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});

const Actions = [
    TaskModuleUIConstants.UpdateTask,
    TaskModuleUIConstants.ViewActivity,
    // TaskModuleUIConstants.Notify
];

const SingleAction = [
    SingleTaskModuleUI.MarkDone,
    SingleTaskModuleUI.SingleUpdate,
];

const { TestFlights } = require('./models/TestFlights');

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);

// Table Storages
const tables = {
    airportTable: "AirportTeams",
    usersTable: "Users",
    flightTable: "Flights",
    activitiesTable: "FlightActivities",
    doneActivitiesTable: "DoneActivities",
    ConvoReferencesTable: "ConvoReferences",
    FlightTodoTable: "DailyTasks",
    TokenTable: "Tokens",
    TaskComments: "TaskComments"
}

const tableClient = tableStore.createTableService(authObject.accountName, authObject.accessKey);

/**
 * Create Table if it doesn't exist
 * @param {String} table - Table key in tables object
 * @returns void
 */
const createTable = table => {
    tableClient.createTableIfNotExists(tables[table], (error, result) => {
        if (error) {
            console.log(`Error Occured in table creation ${error.message}`);
        } else {
            console.log(`Result Table created success ${tables[table]} ${result.created}`);
        }
    });
};

Object.keys(tables).forEach(table => {
    createTable(table);
});

const adapter = new CloudAdapter(botFrameworkAuthentication);

adapter.onTurnError = async(context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Create the bot that will handle incoming messages.
// const bot = new TeamsTaskModuleBot();

// Create the main dialog.
const conversationReferences = {};
const bot = new ProactiveBot(conversationReferences);

// Create HTTP server.
// const server = restify.createServer();
const corsMiddleware = require('restify-cors-middleware2');
const Task = require('node-cron/src/task');
const { resolve } = require('path');
const { info } = require('console');
const { setUncaughtExceptionCaptureCallback } = require('process');

var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: ['X-App-Version'],
    exposeHeaders: []
});

var server = restify.createServer();

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());

webRoutes.init(server,restify);

routes.init(server, tableStore, tableClient);

server.use(restify.plugins.queryParser());

server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
});

server.post('/api/messages', async(req, res) => {
    // Route received a request to adapter for processing
    await adapter.process(req, res, (context) => bot.run(context));
});

// Listen for incoming notifications and send proactive messages to users.
// server.get('/api/notify', async (req, res) => {
//     const reply = MessageFactory.list([
//         getTaskModuleAdaptiveCardOptions()
//     ]);

//     for (const conversationReference of Object.values(conversationReferences)) {
//         await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async context => {
//             await context.sendActivity(reply);
//         });
//     }
// });

// AIRPORT TEAM ENDPOINTS STARTS *********************************************************

server.get('/api/airport-teams', async(request, response) => {
    var query = new tableStore.TableQuery()
        .where('PartitionKey eq ?', 'AirportTeam');

    tableClient.queryEntities(tables.airportTable, query, null, async(error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            var teams = resp.body.value;
            var respData = [];
            for (let i = 0; i < teams.length; i++) {
                var users = await getUsers(teams[i].Location)
                var data = {...teams[i],
                    tcos: [...users.filter(user => user.Role == 'TCO').map(user => user.TeamsID)],
                    duty_officers: [...users.filter(user => user.Role == 'Duty Officer').map(user => user.TeamsID)],
                    duty_mgs: [...users.filter(user => user.Role == 'Duty Manager').map(user => user.TeamsID)]
                };
                respData.push(data);
            }
            response.json({ statusCode: 200, data: respData });
        }
    });
});

async function getUsers(partitionKey) {
    var query = new tableStore.TableQuery()
        .where('PartitionKey eq ?', partitionKey);
    return new Promise((resolve, reject) => {
        tableClient.queryEntities(tables.usersTable, query, null, (error, result, resp) => {
            if (error) {
                reject(error.message);
            } else {
                resolve(resp.body.value);
            }
        });
    });
}

server.get('/api/airport-teams/:rowKey', async(request, response) => {
    let id = request.params.rowKey;
    let partitionKey = 'AirportTeam';

    tableClient.retrieveEntity(tables.airportTable, partitionKey, id, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 404, message: error.message });
        } else {
            response.json({ statusCode: 200, data: resp.body.value });
        }
    });
});

server.post('/api/airport-teams', async(request, response) => {

    let airportTeam = {
        PartitionKey: 'AirportTeam',
        RowKey: uuidv4(),
        TeamName: request.body.name,
        Location: request.body.location,
        LocationShort: request.body.location_short,
        Zone: request.body.zone,
        ChannelID: request.body.ChannelID,
        TeamID: request.body.TeamID,
    }
    tableClient.insertEntity(tables.airportTable, airportTeam, (error, result) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            saveUsers(request)
            response.json({ statusCode: 200, message: 'Airport team created successfully' });
        }
    });
});

server.put('/api/airport-teams/:rowKey', async(request, response) => {
    let id = request.params.rowKey;
    let partitionKey = 'AirportTeam';

    tableClient.retrieveEntity(tables.airportTable, partitionKey, id, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 404, message: `Error updating entity: ${error.message}` });
        } else {
            // if the record is found then update
            let airportTeam = {
                PartitionKey: 'AirportTeam',
                RowKey: id,
                TeamName: request.body.name,
                Location: request.body.location,
                LocationShort: request.body.location_short,
                Zone: request.body.zone,
                ChannelID: request.body.channelID,
                TeamID: request.body.TeamID,
            }

            tableClient.replaceEntity(tables.airportTable, airportTeam, (error, result) => {
                if (error) {
                    response.json({ statusCode: 500, message: `Error updating entity: ${error.message}` });
                } else {
                    if (typeof request.body.tcos != 'undefined' && request.body.tcos.length > 0) {
                        updateUsers(request.body.tcos, 'TCO', request.body.location);
                    }
                    if (typeof request.body.duty_mgs != 'undefined' && request.body.duty_mgs.length > 0) {
                        updateUsers(request.body.duty_mgs, 'Duty Manager', request.body.location);
                    }
                    if (typeof request.body.duty_officers != 'undefined' && request.body.duty_officers.length > 0) {
                        updateUsers(request.body.duty_officers, 'Duty Officer', request.body.location);
                    }
                    response.json({ statusCode: 200, message: 'Update successfull' });
                }
            });

        }
    });
});

// delete airport team from the table based on RowKey and Partition Key
server.del('/api/airport-teams/:rowKey', async(request, response) => {
    let id = request.params.rowKey;
    let partitionKey = 'AirportTeam';

    tableClient.retrieveEntity(tables.airportTable, partitionKey, id, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 404, message: `Error retrieving entity: ${error.message}` });
        } else {
            // if the record is found then update
            let airportTeam = {
                    PartitionKey: partitionKey,
                    RowKey: id
                }
                // delete an entity 
            tableClient.deleteEntity(tables.airportTable, airportTeam, (error, result) => {
                if (error) {
                    response.json({ statusCode: 500, message: `Error deleting entity: ${error.message}` });
                } else {
                    deleteTeamUsers(resp.body.Location);
                    response.json({ statusCode: 200, message: 'Delete successfull' });
                }
            });

        }
    });
});

// AIRPORT TEAM ENDPOINTS ENDS *********************************************************

// AIRPORT ACTIVITIES ENDPOINTS STARTS *********************************************************

// add mistakenly deleted flight activities
/* server.get('/api/add-activities/:flightNumber', async (request, response) => {
    var flightNumber = request.params.flightNumber;
    var query = new tableStore.TableQuery()
            .where('PartitionKey eq ?', flightNumber);
    //7a. execute the query based on the PartitionKey
    tableClient.queryEntities(FlightTodoTable, query, null, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            var todayActivities = filterDataForCurrentDay(resp.body.value);
            var activities = todayActivities.filter( todo => todo.Status == "Pending" );

            for (let i = 0; i < activities.length; i++) {
                var todo = {
                    PartitionKey: "Flight Activities",
                    RowKey: uuidv4(),
                    Task: activities[i].Task
                };
                tableClient.insertEntity(activitiesTable, todo, (error, result) => {
                    if (error) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
            response.json({ statusCode: 200, data: activities });
        }
    });
});  */

server.get('/api/airport-activities/:flightNumber', async(request, response) => {
    var flightNumber = request.params.flightNumber;
    var query = new tableStore.TableQuery()
        .where('PartitionKey eq ?', flightNumber);
    tableClient.queryEntities(tables.FlightTodoTable, query, null, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            var todayActivities = filterDataForCurrentDay(resp.body.value);
            var activities = todayActivities.filter(todo => todo.Status == "Pending");
            response.json({ statusCode: 200, data: activities });
        }
    });
});

server.get('/api/flight-summary/:flightNumber', async(request, response) => {
    var flightNumber = request.params.flightNumber;
    var query = new tableStore.TableQuery()
        .where('FlightNumber eq ?', flightNumber);
    tableClient.queryEntities(tables.flightTable, query, null, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            var flight = resp.body.value[0];
            var query = new tableStore.TableQuery()
                .where('PartitionKey eq ?', flightNumber);

            tableClient.queryEntities(tables.FlightTodoTable, query, null, (error, result, resp) => {
                if (error) {
                    response.json({ statusCode: 500, message: error.message });
                } else {
                    const activities = filterDataForCurrentDay(resp.body.value);
                    doneActivities = activities.filter(todo => todo.Status == "Done");
                    lastUpdateTime = new Date(Math.max(...doneActivities.map(e => new Date(e.Timestamp))));
                    var lastUpdatedTask = doneActivities.filter(e => { var d = new Date(e.Timestamp); return d.getTime() == lastUpdateTime.getTime(); })[0];

                    doneStr = doneActivities.length + "/" + activities.length;
                    const respData = {
                        stage: flight.Status,
                        tasks_completed: doneStr,
                        flight_date: flight.DateOfDept,
                        flight_number: flight.FlightNumber,
                        arrivingFrom: flight.Origin,
                        deptTo: flight.Destination,
                        STA: convertTo24Hrs(flight.STA),
                        STD: convertTo24Hrs(flight.STD),
                        lastUpdatedBy: doneActivities.length > 0 ? lastUpdatedTask.DoneBy : "N/A",
                        lastUpdateAt: doneActivities.length > 0 ? new Date(lastUpdatedTask.Timestamp).toLocaleString('en-US') : "N/A"
                    };
                    response.json({ statusCode: 200, data: respData });
                }
            });
        }
    });
});

// mark airport flight activity as done
server.post('/api/airport-activities/:rowKey/done', async(request, response) => {
    let rowKey = request.params.rowKey;
    var query = new tableStore.TableQuery()
        .where('RowKey eq ?', rowKey);

    tableClient.queryEntities(tables.FlightTodoTable, query, null, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            let data = {
                PartitionKey: request.body.flightNumber,
                RowKey: rowKey,
                Task: resp.body.value[0].Task,
                DoneBy: request.body.user,
                Comment: request.body.comment ? request.body.comment : 'None',
                Status: "Done",
            }

            tableClient.replaceEntity(tables.FlightTodoTable, data, (error, result) => {
                if (error) {
                    response.json({ statusCode: 500, message: `Error updating entity: ${error.message}` });
                } else {
                    response.json({ statusCode: 200, message: 'Update successfull' });
                }
            });
        }
    });
});

server.post('/api/airport-activities/:rowKey/comment', async(request, response) => {
    let taskRowKey = request.params.rowKey;
    let comment = request.body.comment;
    var query = new tableStore.TableQuery()
        .where('RowKey eq ?', taskRowKey);

    tableClient.queryEntities(tables.FlightTodoTable, query, null, async(error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            let currentUser = await getCurrentUser(resp.body.value[0]);
            let commentData = {
                PartitionKey: taskRowKey,
                RowKey: uuidv4(),
                CommentBy: !currentUser ? 'N/A' : currentUser,
                Comment: comment,
            }

            tableClient.insertEntity(tables.TaskComments, commentData, (error, result, resp) => {
                if (error) {
                    response.json({ statusCode: 500, message: `Error updating entity: ${error.message}` });
                } else {
                    console.log("Response here");
                    console.log(result);
                    response.json({ statusCode: 200, message: 'Comment successfull', user: commentData.CommentBy });
                }
            });
        }
    });
});

server.get('/api/airport-activities/:rowKey/comments', async(request, response) => {
    var partitionKey = request.params.rowKey;

    var query = new tableStore.TableQuery()
        .where('PartitionKey eq ?', partitionKey);

    tableClient.queryEntities(tables.TaskComments, query, null, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            var sortedComments = resp.body.value.sort(function compare(a, b) {
                var dateA = new Date(a.Timestamp);
                var dateB = new Date(b.Timestamp);
                return dateA - dateB;
            }).reverse();
            response.json({ statusCode: 200, data: sortedComments });
        }
    });
});

// retrieve completed airport flight activities for the current day based on PartitionKey
server.get('/api/done-airport-activities/flight/:flightNumber', async(request, response) => {
    var partitionKey = request.params.flightNumber;

    var query = new tableStore.TableQuery()
        .where('PartitionKey eq ?', partitionKey);

    tableClient.queryEntities(tables.FlightTodoTable, query, null, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            const doneActivities = filterDataForCurrentDay(resp.body.value);
            const filteredDoneActivities = doneActivities.sort(function compare(a, b) {
                var dateA = new Date(a.Timestamp);
                var dateB = new Date(b.Timestamp);
                return dateA - dateB;
            });
            response.json({ statusCode: 200, data: filteredDoneActivities.filter(todo => todo.Status == "Done") });
        }
    });
});

server.get('/api/notify-users', async(request, response) => {
    // Develop later 
    response.json({ statusCode: 200, message: 'Team members notified' });
});
// AIRPORT ACTIVITIES ENDPOINTS ENDS *********************************************************


// FLIGHTS ENDPOINTS STARTS *********************************************************

// retrieve all flights
server.get('/api/flights', async(request, response) => {
    tableClient.queryEntities(tables.flightTable, null, null, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            const flights = sieveFlights(resp.body.value, request);
            var respData = { statusCode: 200, flights: flights.data };
            if (request.query.download === 'yes') {
                respData = { statusCode: 200, flights: flights.data, download_link: flights.download_link }
            }
            response.json(respData);
        }
    });
});

server.get('/api/flight/stations', async(request, response) => {
    const config = {
        headers: {
            APIKey: 'm2hcHSV2PI78inn49ILKicuR6eKt8Sxg'
        }
    };

    // Parameter
    // departuredate : yyyymmdd
    const url = "https://api.greenafrica.com/API_MicrosoftUAT/api/Station";

    var res = axios.get(url, config)
        .then(res => response.json({ statusCode: 200, data: res.data }))
        .catch(err => console.log(error.message));

    return true;
});

//7. retrieve single task
server.get('/api/flight/:flightNumber/task/:rowKey', (request, response) => {
    var partitionKey = request.params.flightNumber;
    var rowKey = request.params.rowKey;

    tableClient.retrieveEntity(tables.FlightTodoTable, partitionKey, rowKey, (error, result, resp) => {
        if (error) {
            response.json({ statusCode: 500, message: error.message });
        } else {
            response.json({ statusCode: 200, data: resp.body });
        }
    });
});

// server.post('/migrate', (request, response) => {

//     for (let i = 0; i < todos.data.length; i++) {
//         var todo = {
//             "PartitionKey": todos.data[i].PartitionKey,
//             "RowKey": todos.data[i].RowKey,
//             "Category": todos.data[i].Category,
//             "Notification": todos.data[i].Notification,
//             "Role": todos.data[i].Role,
//             "Tag": todos.data[i].Tag,
//             "Task": todos.data[i].Task,
//             "TimeAlloted": todos.data[i].TimeAlloted
//         }
//         tableClient.insertEntity(tables.activitiesTable, todo, (error, result) => {
//             if (error) {
//                 return true;
//             } else {
//                 return false;
//             }
//         });
//     }
//     response.json({statusCode: 200, data: "Migration complete"});
// });

server.get('/public/flights/*', restify.plugins.serveStatic({
    directory: __dirname
}));

// Serve static pages from the 'pages' folder.
server.get('/*', restify.plugins.serveStatic({
    directory: './pages'
}));

// Flight CRON Job (every 20mins - */20 * * * *)
var task = cron.schedule('* * * * *', () => {
    checkFlights();
}, {
    scheduled: true,
    timezone: "Africa/Bangui"
});
task.start();
// CRON Job Ends

function checkFlights() {
    console.log("Running job...");
    const config = {
        headers: {
            APIKey: 'm2hcHSV2PI78inn49ILKicuR6eKt8Sxg'
        }
    };

    // departuredate : yyyymmdd
    var today = new Date().toLocaleDateString('sv').replaceAll('-', '');
    const url = "https://api.greenafrica.com/API_MicrosoftUAT/api/Flight?departuredate=" + today;

    axios.get(url, config)
        .then(res => saveScheduledFlights(res.data))
        .catch(err => saveScheduledFlights(TestFlights));

    checkTaskNotifications();
    return true;
}

function saveScheduledFlights(flights) {
    for (const key in flights) {
        var query = new tableStore.TableQuery()
            .where('FlightNumber eq ?', flights[key].Airline + flights[key].FlightNumber);
        tableClient.queryEntities(tables.flightTable, query, null, (error, result, resp) => {
            if (error) {
                console.log(error);
            } else {
                var todayFlight = filterDataForCurrentDay(resp.body.value);
                if (todayFlight[0] == undefined) {
                    if (Object.hasOwnProperty.call(flights, key)) {
                        let flight = {
                            PartitionKey: flights[key].Airline,
                            RowKey: uuidv4(),
                            STA: flights[key].STAUTC,
                            STD: flights[key].STDUTC,
                            DateOfDept: flights[key].DepartureDate,
                            DateArrived: 'N/A',
                            DateDeparted: 'N/A',
                            Origin: flights[key].DepartureStation,
                            Destination: flights[key].ArrivalStation,
                            FlightNumber: flights[key].Airline + flights[key].FlightNumber,
                            Status: 'Awaiting arrival',
                            TimeOnGround: '0:00',
                            Performance: 'Okay',
                        }
                        tableClient.insertEntity(tables.flightTable, flight, (error, result) => {
                            if (error) {
                                return true;
                            } else {
                                console.log('Notifying for flight');
                                buildFlightTodo(flight.FlightNumber);
                                notifyStations(flight);
                                notifyStations(flight, false); // false to indicate notification to Destination
                                return false;
                            }
                        }); 
                    }
                } else {
                    // check for any changes and update
                    if (todayFlight[0].STA != flights[key].STAUTC) {
                        todayFlight[0].STA = flights[key].STAUTC;

                        tableClient.replaceEntity(tables.flightTable, todayFlight[0], (error, result) => {
                            if (error) {
                                console.log(`Error updating entity: ${error.message}`);
                            } else {
                                console.log('Flight info updated');
                            }
                        });
                    }

                    if (todayFlight[0].STD != flights[key].STDUTC) {
                        todayFlight[0].STD = flights[key].STDUTC;
                        
                        tableClient.replaceEntity(tables.flightTable, todayFlight[0], (error, result) => {
                            if (error) {
                                console.log(`Error updating entity: ${error.message}`);
                            } else {
                                console.log('Flight info updated');
                            }
                        });
                    }

                    if (todayFlight[0].DateOfDept != flights[key].DepartureDate) {
                        todayFlight[0].DateOfDept = flights[key].DepartureDate;

                        tableClient.replaceEntity(tables.flightTable, todayFlight[0], (error, result) => {
                            if (error) {
                                console.log(`Error updating entity: ${error.message}`);
                            } else {
                                console.log('Flight info updated');
                            }
                        });
                    }
                    // Later check to update the static flight info(Status, TimeOnGround, Performance etc)
                }
            }
        });
    }
    return true;
}

function buildFlightTodo(flightNumber) {
    var query = new tableStore.TableQuery()
    tableClient.queryEntities(tables.activitiesTable, query, null, (error, result, resp) => {
        if (error) {
            console.log(error);
        } else {
            var tasks = resp.body.value;
            for (let i = 0; i < tasks.length; i++) {
                var todo = {
                    PartitionKey: flightNumber,
                    RowKey: uuidv4(),
                    Task: tasks[i].Task,
                    TimeAlloted: tasks[i].TimeAlloted,
                    Category: tasks[i].Category,
                    Notification: tasks[i].Notification,
                    Role: tasks[i].Role,
                    Status: "Pending",
                    DoneBy: "N/A",
                    Comment: "N/A",
                };
                tableClient.insertEntity(tables.FlightTodoTable, todo, (error, result) => {
                    if (error) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
    });
    return true;
}

function checkTaskNotifications() {
    tableClient.queryEntities(tables.FlightTodoTable, null, null, async(error, result, resp) => {
        if (error) {
            return false;
        } else {
            var currentDayActivities = filterDataForCurrentDay(resp.body.value);
            var pendingActivities = currentDayActivities.filter(task => task.Status == 'Pending');
            var activities = pendingActivities.filter(p => p.Notification == 'Auto');
            for (let i = 0; i < activities.length; i++) {
                var flight = await getFlight(activities[i].PartitionKey);
                var timeToDepartureInMins = Math.ceil(((new Date(flight.STD) - new Date()) / 1000) / 60);
                var timeAfterDepartureInnMins = Math.ceil(((new Date(flight.STD) + new Date()) / 1000) / 60);
                var arrivalTimeInMins = Math.ceil(((new Date(flight.STA) + new Date()) / 1000) / 60);

                if (activities[i].Category == 'Post Departure') {
                    var diffTimeAfterDeparture = timeAfterDepartureInnMins - activities[i].TimeAlloted;
                    if (diffTimeAfterDeparture >= 0) {
                        sendNotificationForTaskDue(activities[i], flight);
                    }
                } else if (activities[i].Category == 'Pre Flight') {
                    var diffTimeToDeparture = timeToDepartureInMins - activities[i].TimeAlloted;
                    if (diffTimeToDeparture < 1) {
                        sendNotificationForTaskDue(activities[i], flight);
                    }
                } else {
                    if (activities[i].Tag == 'STD') {
                        var diffTimeToDeparture = timeToDepartureInMins - activities[i].TimeAlloted;
                        if (diffTimeToDeparture < 1) {
                            sendNotificationForTaskDue(activities[i], flight);
                        }
                    } else if (activities[i].Tag == 'STA') {
                        var expTaskDueTime = Math.ceil(((new Date(flight.STA)) / 1000) / 60) + activities[i].TimeAlloted;
                        if (arrivalTimeInMins >= expTaskDueTime) {
                            sendNotificationForTaskDue(activities[i], flight);
                        }
                    }
                }
            }
        }
    });
}

async function getFlight(FlightNumber) {
    return new Promise((resolve, reject) => {
        var query = new tableStore.TableQuery()
            .where('FlightNumber eq ?', FlightNumber);
        tableClient.queryEntities(tables.flightTable, query, null, (error, result, resp) => {
            if (error) {
                reject(error.message);
            } else {
                resolve(resp.body.value[0]);
            }
        });
    });
}

async function getCurrentUser(task) {
    return new Promise(async(resolve, reject) => {
        var flight = await getFlight(task.PartitionKey);
        var locationShort = '';
        if (task.Category == 'Pre Flight') {
            locationShort = flight.Origin;
        } else {
            locationShort = flight.Destination;
        }
        var query = new tableStore.TableQuery()
            .where('LocationShort eq ?', locationShort);
        tableClient.queryEntities(tables.airportTable, query, null, (error, result, resp) => {
            if (error) {
                console.log(error);
                resolve(false);
            } else {
                if (resp.body.value[0] != undefined) {
                    var query = new tableStore.TableQuery()
                        .where('PartitionKey eq ?', resp.body.value[0].ChannelID);
                    tableClient.queryEntities(tables.ConvoReferencesTable, query, null, (error, result, resp) => {
                        if (error) {
                            console.log(error);
                            resolve(false);
                        } else {
                            if (resp.body.value[0] != undefined) {
                                var conversationReference = JSON.parse(resp.body.value[0].convoRefJson);
                                resolve(conversationReference.user.name);
                            } else {
                                console.log("No channel ID found");
                                resolve(false);
                            }
                        }
                    });
                } else {
                    resolve(false);
                }
            }
        });
    });
}

function sendNotificationForTaskDue(task, flight) {
    var locationShort = '';
    if (task.Category == 'Pre Flight') {
        locationShort = flight.Origin;
    } else {
        locationShort = flight.Destination;
    }

    var query = new tableStore.TableQuery()
        .where('LocationShort eq ?', locationShort);
    tableClient.queryEntities(tables.airportTable, query, null, (error, result, resp) => {
        if (error) {
            console.log(error);
        } else {
            if (resp.body.value[0] != undefined) {

                var query = new tableStore.TableQuery()
                    .where('PartitionKey eq ?', resp.body.value[0].ChannelID);
                tableClient.queryEntities(tables.ConvoReferencesTable, query, null, (error, result, resp) => {
                    if (error) {
                        console.log(error);
                    } else {
                        if (resp.body.value[0] != undefined) {
                            console.log("Notifying for due task...");
                            var conversationReference = JSON.parse(resp.body.value[0].convoRefJson);
                            notifyDueTask(task, conversationReference, flight);
                        }
                    }
                });
            }
        }
    });
}

function notifyDueTask(task, conversationReference, flight) {
    console.log("Notifying for due task...")
    const notification = MessageFactory.list([
        getTaskAdaptiveCard(task, flight)
    ]);

    notification.Summary = 'New task due for flight: ' + flight.flightNumber;

    adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async context => {
        await context.sendActivity(notification);
    });

    return true;
}

function getTaskAdaptiveCard(task, flight) {
    var imageIcon = "https://greenafrica.azurewebsites.net/public/flights/icon.png";

    const action = SingleAction.map((cardType) => {
        return {
            type: 'Action.Submit',
            title: cardType.buttonTitle,
            data: { msteams: { type: 'task/fetch' }, data: cardType.id, flightNumber: flight.FlightNumber, taskRowKey: task.RowKey }
        };
    });

    const adaptiveCard = {
        "type": "AdaptiveCard",
        "body": [
            // {
            //     "type": "ColumnSet",
            //     "columns": [{
            //             "type": "Column",
            //             "items": [{
            //                 "type": "Image",
            //                 "url": imageIcon,
            //                 "width": "30px",
            //                 "height": "30px"
            //             }],
            //             "width": "auto"
            //         },
            //         {
            //             "type": "Column",
            //             "width": "stretch",
            //             "items": [{
            //                 "type": "TextBlock",
            //                 "weight": "Default",
            //                 "text": flight.FlightNumber,
            //                 "wrap": true,
            //                 "horizontalAlignment": "Left",
            //                 "size": "Default"
            //             }]
            //         },
            //     ]
            // },
            {
                "type": "TextBlock",
                "text": "Due task alert for flight " + flight.FlightNumber,
                "weight": "Bolder",
                "wrap": true,
                "color": "Warning",
                "size": "Medium"
            },
            {
                "type": "FactSet",
                "facts": [{
                        "title": "Task:",
                        "value": task.Task
                    },
                    {
                        "title": "STD:",
                        "value": convertTo24Hrs(flight.STD)
                    }
                ]
            }
        ],
        "actions": action,
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3"
    }

    return CardFactory.adaptiveCard(adaptiveCard);
}

function notifyStations(flight, origin = true) {
    var locationShort = '';
    if (origin) {
        locationShort = flight.Origin;
    } else {
        locationShort = flight.Destination;
    }
    var query = new tableStore.TableQuery()
        .where('LocationShort eq ?', locationShort);
    tableClient.queryEntities(tables.airportTable, query, null, (error, result, resp) => {
        if (error) {
            console.log(error);
        } else {
            if (resp.body.value[0] != undefined) {
                var query = new tableStore.TableQuery()
                    .where('PartitionKey eq ?', '029514d0-f2c0-11ec-a102-31e394049c93|livechat');
                tableClient.queryEntities(tables.ConvoReferencesTable, query, null, (error, result, resp) => {
                    if (error) {
                        console.log(error);
                    } else {
                        if (resp.body.value[0] != undefined) {
                            console.log("Notifying for scheduled flight...")
                            sendNotification(JSON.parse(resp.body.value[0].convoRefJson), flight, origin);
                        }
                    }
                });
            }
        }
    });
}

// Change the convo reference/channel ID FOR THIS OP
function sendNotification(conversationReference, flight, origin) {
    const notification = MessageFactory.list([
        getTaskModuleAdaptiveCardOptions(flight, origin)
    ]);

    notification.Summary = 'New flight arrival posted for ' + flight.flightNumber;

    adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async context => {
        await context.sendActivity(notification);
    });

    return true;
}

function getTaskModuleAdaptiveCardOptions(flightData, origin) {
    const flight = {
        "title": "GA Turnaround",
        "direction": origin === true ? "Outgoing" : "Incoming",
        "dateOfDept": new Date(flightData.DateOfDept).toLocaleString().replace(/(.*)\D\d+/, '$1'),
        "STD": convertTo24Hrs(flightData.STD),
        "STA": convertTo24Hrs(flightData.STA),
        "deptTo": flightData.Destination,
        "arrivingFrom": flightData.Origin,
        "flightNumber": flightData.FlightNumber,
    }

    const actions = Actions.map((cardType) => {
        return {
            type: 'Action.Submit',
            title: cardType.buttonTitle,
            data: { msteams: { type: 'task/fetch' }, data: cardType.id, flightNumber: flightData.FlightNumber, rowKey: flightData.RowKey }
        };
    });

    const adaptiveCard = {
        "type": "AdaptiveCard",
        "body": [
            // {
            //     "type": "ColumnSet",
            //     "columns": [
            //         {
            //             "type": "Column",
            //             "items": [{
            //                 "type": "Image",
            //                 "url": flight.flight.image,
            //                 "width": "30px",
            //                 "height": "30px"
            //             }],
            //             "width": "auto"
            //         },
            //         {
            //             "type": "Column",
            //             "width": "stretch",
            //             "items": [{
            //                 "type": "TextBlock",
            //                 "weight": "Default",
            //                 "text": flight.flight.name,
            //                 "wrap": true,
            //                 "horizontalAlignment": "Left",
            //                 "size": "Default"
            //             }]
            //         },
            //     ]
            // },
            {
                "type": "TextBlock",
                "text": "New " + flight.direction + " Flight Alert - " + flight.flightNumber,
                "weight": "Bolder",
                "wrap": true,
                "color": "Good",
                "size": "Medium"
            },
            {
                "type": "FactSet",
                "facts": [{
                        "title": "Date of departure:",
                        "value": flight.dateOfDept
                    },
                    {
                        "title": "STA:",
                        "value": flight.STA
                    },
                    {
                        "title": "STD:",
                        "value": flight.STD
                    },
                    {
                        "title": origin === true ? "Departing to:" : "Arriving from:",
                        "value": origin === true ? flight.deptTo : flight.arrivingFrom
                    }
                ]
            }
        ],
        "actions": actions,
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3"
    }

    return CardFactory.adaptiveCard(adaptiveCard);
}

// FLIGHTS ENDPOINTS ENDS *********************************************************


// AUXILIARY FUNCTIONS *********************************************************
function saveUsers(request) {
    var tcos = request.body.tcos;
    var duty_mgs = request.body.duty_mgs;
    var duty_officers = request.body.duty_officers;
    var success = false;
    for (var key in tcos) {
        let tcoUser = {
            PartitionKey: request.body.location,
            RowKey: uuidv4(),
            Role: 'TCO',
            TeamsID: tcos[key]
        }
        tableClient.insertEntity(tables.usersTable, tcoUser, (error, result) => {
            if (error) {
                success = false;
            } else {
                success = true;
            }
        });
    }

    for (var key in duty_officers) {
        let dutyOfficerUser = {
            PartitionKey: request.body.location,
            RowKey: uuidv4(),
            Role: 'Duty Officer',
            TeamsID: duty_officers[key]
        }
        tableClient.insertEntity(tables.usersTable, dutyOfficerUser, (error, result) => {
            if (error) {
                success = false;
            } else {
                success = true;
            }
        });
    }

    for (var key in duty_mgs) {
        let dutyMgUser = {
            PartitionKey: request.body.location,
            RowKey: uuidv4(),
            Role: 'Duty Manager',
            TeamsID: duty_mgs[key]
        }
        tableClient.insertEntity(tables.usersTable, dutyMgUser, (error, result) => {
            if (error) {
                success = false;
            } else {
                success = true;
            }
        });
    }

    return success;
}

function updateUsers(users, role, partitionKey) {
    for (let i = 0; i < users.length; i++) {
        var query = new tableStore.TableQuery()
            .where('TeamsID eq ?', users[i]);
        tableClient.queryEntities(tables.usersTable, query, null, (error, result, resp) => {
            if (error) {
                console.log(error);
            } else {
                var dbUser = resp.body.value;
                if (dbUser.length > 0) {
                    let user_query = {
                        PartitionKey: dbUser[0].PartitionKey,
                        RowKey: dbUser[0].RowKey,
                        Role: role,
                        TeamsID: users[i]
                    }
                    tableClient.replaceEntity(tables.usersTable, user_query, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }else{
                    // User does not exist in db.
                    // Add new user
                    let user = {
                        PartitionKey: partitionKey,
                        RowKey: uuidv4(),
                        Role: role,
                        TeamsID: users[i]
                    }
                    tableClient.insertEntity(tables.usersTable, user, (error, result) => {
                        if (error) {
                            success = false;
                        } else {
                            success = true;
                        }
                    });
                }
            }
        });
    }

    // Remove deleted TeamsIDs
    var query = new tableStore.TableQuery()
    .where('PartitionKey eq ?', partitionKey);
    tableClient.queryEntities(tables.usersTable, query, null, (error, result, resp) => {
        if (error) {
            return true;
        } else {
            var dbUsers = resp.body.value.filter(user => user.Role == role);
            if (dbUsers.length > 0) {
                for (let i = 0; i < dbUsers.length; i++) {
                    if (users.includes(dbUsers[i].TeamsID)) {
                        console.log('Contains')
                    }else{
                        let user_query = {
                            PartitionKey: dbUsers[i].PartitionKey,
                            RowKey: dbUsers[i].RowKey,
                            Role: role,
                            TeamsID: dbUsers[i].TeamsID
                        }
                        // delete an entity 
                        tableClient.deleteEntity(tables.usersTable, user_query, (error, result) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                }
            }
        }
    });
}

function deleteTeamUsers(partitionKey) {
    var query = new tableStore.TableQuery()
        .where('PartitionKey eq ?', partitionKey);
    tableClient.queryEntities(tables.usersTable, query, null, (error, result, resp) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            var users = resp.body.value;
            users.forEach(user => {
                let user_query = {
                        PartitionKey: partitionKey,
                        RowKey: user.RowKey
                    }
                    // delete an entity 
                tableClient.deleteEntity(tables.usersTable, user_query, (error, result) => {
                    if (error) {
                        console.log(error);
                        return false;
                    } else {
                        return true;
                    }
                });
            });
            return true;
        }
    });
}

async function getStations()
{
    const config = {
        headers: {
            APIKey: 'm2hcHSV2PI78inn49ILKicuR6eKt8Sxg'
        }
    };

    // Parameter
    // departuredate : yyyymmdd
    const url = "https://api.greenafrica.com/API_MicrosoftUAT/api/Station";

    return await axios.get(url, config)
        .then(res => res.data)
        .catch(err => console.log(error.message));
}

function sieveFlights(tableData, request) {
    const flights = { data: tableData, download_link: '' };
    var origin = request.query.origin;
    var destination = request.query.destination;
    var sta = request.query.sta;
    var download = request.query.download;

    if (origin != undefined && origin != '') {
        flights.data = flights.data.filter(flight => flight.Origin == origin);
    }

    if (destination != undefined && destination != '') {
        flights.data = flights.data.filter(flight => flight.Destination == destination);
    }

    if (sta != undefined && sta != '') {
        var searchedDate = new Date(sta).toLocaleDateString();
        flights.data = flights.data.filter(flight => new Date(flight.STA).toLocaleDateString() == searchedDate);
    }

    if (download === 'yes') {
        const fields = ['FlightNumber', 'Origin', 'STA', 'STD', 'Status', 'Destination', 'Performance', 'TimeOnGround'];
        const opts = { fields };

        try {
            const parser = new Parser(opts);
            const csv = parser.parse(flights.data);
            // write CSV to a file
            var fileName = 'Flight-Ops.csv';
            fs.writeFileSync('./public/flights/' + fileName, csv);
            var link = process.env.BaseUrlTest + "/public/flights/" + fileName;
            flights.download_link = link;
        } catch (err) {
            console.error(err);
        }
    }

    return flights;
}

function filterFlightsForCurrentDay(flights) {
    return flights.filter(flight => new Date(flight.STA) >= new Date(Date.UTC(0, 0, 0, 0, 0, 0)));
}

function filterDataForCurrentDay(datas) {
    return datas.filter(data => new Date(data.Timestamp) >= new Date(Date.UTC(0, 0, 0, 0, 0, 0)));
}

function convertTo24Hrs(dateStr) {
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hourCycle: 'h23',
        hour: "2-digit",
        minute: "2-digit",
    });
}