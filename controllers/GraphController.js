const { default: axios } = require("axios");
const AuthController = require("./AuthController");

class GraphController {
    /**
     * @var {String} baseUrl - GraphAPI base url
     */
    baseUrl = "https://graph.microsoft.com/v1.0";

    /**
     * @var {Array} specialHandlers - Special handler methods for unique requests
     */
    specialHandlers = ['updateMembers'];

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
     * Handles requests from client app and pings GraphAPI
     * @param {Object} req - Request Object
     * @param {Object} res - Response Object
     * @param {String} endpointKey - GraphAPI endpoint key
     */
    async handler(req, res, endpointKey = '') {

        let token = await new AuthController(
            this.tableStore,
            this.tableClient
        ).getActiveToken();

        // Check for special requests
        if (this.specialHandlers.includes(endpointKey)) {
            let resp = await this[endpointKey](req, token);

            res.send(resp[0], resp[1]);
        }

        // Handle normal requests
        else {

            let url = req.url.replace('/graph', '')

            url = url.includes('users') ? url+`?$top=999&$filter=endswith(mail,'@greenafrica.com')&accountEnabled eq true&$count=true` : url;

            let config = {
                method: req.method, url: this.baseUrl+url,
                headers: { Authorization: `Bearer ${token?.access_token}`, ConsistencyLevel: 'eventual' }
            };

            if (['POST', 'PATCH', 'PUT'].includes(req.method)) config.data = req.body;

            axios(config)
                .then(async (resp) => {
                    res.send(await this.composeResponse(resp, endpointKey, config));
                })
                .catch((error) => {
                    let err = this.formatError(error);

                    res.send(err[0], err[1]);
                });
        }
    }

    /**
     * Update Channel members
     * @param {Object} req - Request Object
     * @param {Object} token - Access token data
     */
    async updateMembers(req, token) {

        let resp = [];
        let url = req.url.replace('/graph', '');

        let config = {
            headers: {
                Authorization: `Bearer ${token?.access_token}`,
            },
        };

        let membersToAdd = req.body.add ?? [];
        let membersToRemove = req.body.remove ?? [];

        const runRequest = async(config) => {
            return await axios(config).then(() => true).catch((error) => this.formatError(error));
        }

        // Remove members
        for(let member of membersToRemove) {
            config.method = 'delete';
            config.url = `${this.baseUrl}${url}/${member}`;

            let r = await runRequest(config);
            if(r !== true) return r;
        }

        // Add members
        let data = [];
        for(let member of membersToAdd) {
            data.push({
                '@odata.type': '#microsoft.graph.aadUserConversationMember',
                roles: [member.role],
                'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${member.id}')`
            });
        }
        let r = await runRequest({...config, method: 'post', url: this.baseUrl + url + '/add', data: {values: data} });
        if(r !== true) return r;

        return [200, {
            status: true,
            message: 'Team members updated'
        }];
    }

    /**
     * This handles and formats special response data
     * @param {Object} res - Response object
     * @param {String} endpointKey - GraphAPI endpoint key
     * @param {Object} config - Axios config object
     * @returns data object
     */
    async composeResponse(res, endpointKey, config) {
        let data;

        switch(endpointKey) {
            case 'createTeam':
                let teamId = res.headers['content-location'].split("'")[1];

                // Get General channel id
                // let deleteTeamAction = async () => {
                //     await this.silentHandler({
                //         ...config, 
                //         method: 'delete',
                //         url: `${this.baseUrl}/groups/${teamId}`
                //     });
                // };

                let url = `${this.baseUrl}/teams/${teamId}/channels`;

                let channelId = (
                    await this.silentHandler({...config, method: 'get', url})
                ).value[0].id;

                data = { status: true, data: {teamId, channelId} };
                break;

            default:
                data = {
                    status: true,
                    data: res.data,
                };
                break;
        }

        return data;
    }

    /**
     * Format error response
     * @param {Object} error - Error object
     */
    formatError(error) {
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

        return [error.response.status ? error.response.status : 500, {
            status: false,
            message: message,
        }];
    }

    /**
     * Internal server GraphAPI handler
     * @param {Object} config - Axios config object
     * @returns Promise(array|true|false)
     */
    async silentHandler(config) {

        return new Promise((resolve, reject) => {
            axios(config)
                .then((res) => resolve(res.data))
                .catch((error) => {
                    console.error(error);

                    reject(false);
                });
        });
    }
}

module.exports = GraphController;