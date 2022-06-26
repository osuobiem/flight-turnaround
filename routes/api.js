const bodyParser = require('body-parser');

const AuthController = require("../controllers/AuthController");
const GraphController = require("../controllers/GraphController");
// const AirportTeamController = require("../controllers/AirportTeamController");

const api = {

    /**
     * Initialize routes and pass them to server object
     * @param {Object} server - Server object from index.js
     * @param {Object} tableStore - MS Azure Table Storage instance
     * @param {Object} tableClient - MS Azure Table Client instance
     * @returns void
     */
    init: (server, tableStore, tableClient) => {
        // server.use(bodyParser.json());
        // server.use(function(req, res, next) {
        //     console.log(req.body);
        //     return next();
        // });

        // Array of route data
        const routes = [

            // Switch client-side token (assertion) with server side (GraphAPI Authorized) access token
            {
                path: 'switch-tokens',
                method: 'post',
                handler: 'auth.switchTokens'
            },

            // Get People in an Organization using GraphAPI
            {
                path: 'users',
                method: 'get',
                handler: 'graph'
            },

            // Get Team members using GraphAPI
            {
                path: 'teams/:id/members',
                method: 'get',
                handler: 'graph'
            },

            // Create Team using GraphAPI
            {
                path: 'teams',
                method: 'post',
                handler: 'graph.createTeam'
            },

            // Get Team using GraphAPI
            {
                path: 'teams/:id',
                method: 'get',
                handler: 'graph'
            },

            // Update Team using GraphAPI
            {
                path: 'teams/:id',
                method: 'patch',
                handler: 'graph'
            },

            // Delete Team using GraphAPI
            {
                path: 'groups/:id',
                method: 'del',
                handler: 'graph'
            },

            // Add/Remove Members to Channel in Team using GraphAPI
            {
                path: 'teams/:id/members',
                method: 'post',
                handler: 'graph.updateMembers'
            },

            // Get All Airport Teams
            // {
            //     path: 'airport-teams',
            //     method: 'get',
            //     handler: 'api.getTeams'
            // }
        ];

        // Controller objects to handle requests
        const handlers = {
            auth: new AuthController(tableStore, tableClient),
            graph: new GraphController(tableStore, tableClient),
            // api: new AirportTeamController(tableStore, tableClient)
        };


        // Handle client requests
        routes.forEach(route => {

            // Route data
            let controllerKey = route.handler.split('.')[0];

            let controller = handlers[controllerKey];
            let method = route.handler.split('.')[1];

            let httpMethod = route.method;
            let url = `/${controllerKey}/${route.path}`;

            // Pass request down to handler method
            controllerKey === 'graph' ?
                server[httpMethod](url, (req, res) => controller.handler(req, res, method)) :
                server[httpMethod](url, (req, res) => controller[method](req, res))
        });

    }

};

module.exports = api;