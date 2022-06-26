const { default: axios } = require("axios");
const { v4: uuidv4 } = require('uuid');

class AuthController {

    /**
     * @var {String} tableName - DB table name
     */
    tableName = "Tokens";

    /**
     * Class constructor
     * @param {Object} tableStore - MS Azure Table Storage instance
     * @param {Object} tableClient - MS Azure Table Client instance
     */
    constructor(tableStore, tableClient) {
        this.tableStore = tableStore;
        this.tableClient = tableClient;
    }

    /**
     * Switch client-side token (assertion) with server side (GraphAPI Authorized) access token
     * @param {Object} req - Request Object
     * @param {Object} res - Response Object
     * @returns void
     */
    async switchTokens(req, res) {
        let access_token = req.body.access_token;

        const data = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: access_token,
            requested_token_use: 'on_behalf_of',
            scope: process.env.SCOPES
        }).toString();

        const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

        const config = {
            method: 'get',
            url,
            data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };

        let resp = await this.getAccessToken(config, res);
    }

    /**
     * Get and store server side (GraphAPI Authorized) access token
     * @param {Object} config - Axios config object
     * @returns Status object
     */
    async getAccessToken(config, res = false) {
        let token = await this.getActiveToken();

        return await axios(config)
            .then(resp => {
                let data = resp.data;

                // Add info to response data to save in db
                data.PartitionKey = 'AccessToken';
                data.RowKey = uuidv4();

                return new Promise((resolve, reject) => {

                    this.tableClient.insertEntity(this.tableName, data, async(error, result) => {
                        if (error) {
                            console.error(error);
                            reject(false);

                            if (res) {
                                res.send({
                                    status: true,
                                    message: error
                                });
                            }
                        } else {

                            // Delete old token
                            await this.deleteActiveToken(token.RowKey);

                            // Recursively get token when it expires
                            setTimeout(() => this.getAccessToken(config, false), parseInt(data.expires_in) * 1000);
                            resolve(true);

                            if (res) {
                                res.send({
                                    status: true,
                                    message: 'Token Switch successful'
                                });
                            }
                        }
                    });
                });
            })
            .catch(error => {
                let message;

                if (error.response) {
                    message = error.response.data;
                    console.error(error.response.data);
                } else if (error.request) {
                    message = error.request;
                    console.error(error.request);
                } else {
                    message = error.message;
                    console.error("Error", error.message);
                }

                if (res) {
                    res.send(error.response.status ? error.response.status : 500, {
                        status: false,
                        message: message,
                    });
                }
            });
    }

    /**
     * Get active token from db
     * @returns false | object
     */
    getActiveToken() {
        let query = new this.tableStore.TableQuery()
            .where('PartitionKey eq ?', 'AccessToken')

        return new Promise((resolve, reject) => {
            this.tableClient.queryEntities(this.tableName, query, null, (error, result, resp) => {
                if (error) {
                    reject(false);
                } else {
                    resolve(resp.body.value[0]);
                }
            });
        });
    }

    /**
     * Delete old/expired tokens
     * @param {String} RowKey 
     * @returns true|false
     */
    deleteActiveToken(RowKey) {
        return new Promise((resolve, reject) => {
            this.tableClient.deleteEntity(this.tableName, { PartitionKey: 'AccessToken', RowKey }, (error, result) => {
                if (error) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = AuthController;