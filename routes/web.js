const web = {
    /**
     * Initialize routes and pass them to server object
     * @param {Object} server - Server object from index.js
     * @param {Object} restify - Restify instance
     * @returns void
     */
    init: (server, restify) => {
        server.get("/", restify.plugins.serveStaticFiles("./pages/web/"));
        server.get(
            "/static/*",
            restify.plugins.serveStaticFiles("./pages/web/static")
        );
        server.get(
            "/admin",
            restify.plugins.serveStaticFiles("./pages/web/")
        );
    },
};

module.exports = web;
