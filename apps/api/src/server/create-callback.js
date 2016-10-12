const applyDefaults = require("../utils/apply-defaults");
const createCors = require("../middleware/create-cors");
const createHouseholdExtractor = require("../middleware/create-household-extractor");
const createJsonBodyParser = require("koa-json-body");
const createKoaGroupRouter = require("koa-group-router");
const createRequestIdentifier = require("../middleware/create-request-identifier");
const createResponseTimer = require("../middleware/create-response-timer");
const createServiceInjector = require("koa-service-injector");
const createStatic = require("../middleware/create-static");
const createUserExtractor = require("../middleware/create-user-extractor");
const Koa = require('koa');
const rootGroup = require("./routes");

module.exports = function createCallback (mode, services, middlewares) {
    middlewares = applyDefaults(middlewares, {
        cors:               createCors(),
        extractHouseholdId: createHouseholdExtractor(services.logger),
        parseJsonBody:      createJsonBodyParser(),
        identifyRequest:    createRequestIdentifier(),
        timeResponse:       createResponseTimer(),
        serveStatic:        createStatic(),
        extractUserId:      createUserExtractor(services.logger),

        injectServices:     createServiceInjector(services, function (ctx) {
            ctx.services.logger = ctx.services.logger.child({
                "request_id": ctx.request.id,
                "route": {
                    "method": ctx.route.method,
                    "path": ctx.route.path,
                },
            });
        }),
    });

    const koaApp = new Koa();
    koaApp.use(createKoaGroupRouter(rootGroup, middlewares));

    if (mode !== "production") {
        koaApp.use(middlewares.serveStatic);
    }

    return koaApp.callback();
};
