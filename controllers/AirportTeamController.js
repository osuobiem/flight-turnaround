const { default: axios } = require("axios");
const { v4: uuidv4 } = require('uuid');

class AirportTeamController {

    /**
     * Class constructor
     * @param {Object} tableStore - MS Azure Table Storage instance
     * @param {Object} tableClient - MS Azure Table Client instance
     */
     constructor(tableStore, tableClient) {
        this.tableStore = tableStore;
        this.tableClient = tableClient;
        this.tableName = "AirportTeams";
    }

    /**
     * Get all airport teams from db
     * @returns null | object
     */
    async getTeams(req, res){
        var query = new this.tableStore.TableQuery()
        .where('PartitionKey eq ?', 'AirportTeam');

        this.tableClient.queryEntities(this.tableName, query, null, async(error, result, resp) => {
            if (error) {
                res.json({ statusCode: 500, message: error.message });
            } else {
                var teams = resp.body.value;
                var respData = [];
                for (let i = 0; i < teams.length; i++) {
                    var users = await this.getTeamMembers(teams[i].Location)
                    var data = {...teams[i], 
                        tcos: [...users.filter(user => user.Role == 'TCO').map(user => user.TeamsID)],
                        duty_officers: [...users.filter(user => user.Role == 'Duty Officer').map(user => user.TeamsID)],
                        duty_mgs: [...users.filter(user => user.Role == 'Duty Manager').map(user => user.TeamsID)]
                    };
                    respData.push(data);
                }
                res.json({ statusCode: 200, data: respData });
            }
        });
    }

    /**
     * Get all teams members for an Airport Team
     * @returns null | object
     */
    async getTeamMembers(partitionKey) {
        var query = new this.tableStore.TableQuery()
            .where('PartitionKey eq ?', partitionKey);
        return new Promise((resolve, reject) => {
            this.tableClient.queryEntities(this.tableName, query, null, (error, result, resp) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(resp.body.value);
                }
            });
        });
    }
}

module.exports = AirportTeamController;