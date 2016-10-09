const applyDefaults = require("../utils/apply-defaults");
const collapseRoutingGroup = require("./route-tools/collapse-group");
const createUserExtractor = require("../middleware/create-user-extractor");
const createHouseholdExtractor = require("../middleware/create-household-extractor");
const createJsonBodyParser = require("koa-json-body");
const createKoaCorsMw = require("koa-cors");
const createRequestIdentifier = require("../middleware/create-request-identifier");
const createResponseTimer = require("../middleware/create-response-timer");
const createKoaStatic = require("koa-static");
const createKoaRouter = require("koa-router");
const Koa = require('koa');
const rootGroup = require("./routes");

module.exports = function createCallback (services) {
    services = applyDefaults(services, {
        householdExtractorMw: createHouseholdExtractor(services.logger),
        jsonBodyParserMw:     createJsonBodyParser(),
        requestIdentifierMw:  createRequestIdentifier(),
        responseTimerMw:      createResponseTimer(),
        userExtractorMw:      createUserExtractor(services.logger),
        // corsMw:               createKoaCorsMw({
        //                                         origin: "*",
        //                                         methods: [
        //                                             "PUT",
        //                                             "POST",
        //                                             "GET",
        //                                             "DELETE",
        //                                             "OPTIONS",
        //                                         ],
        //                                     }),
    });

    const router = createKoaRouter();
    for (const route of collapseRoutingGroup(rootGroup)) {
        // Pre-validate that the route's dependencies exist but don't collect
        // them yet.
        for (const name of route.deps) {
            if (!services[name]) {
                throw new Error(`Invalid service "${ name }"`);
            }
        }

        // Collect all of the route's middlewares in order they are requested.
        const middlewares = route.middlewares.map(name => {
            const serviceName = `${ name }Mw`;
            if (!services[serviceName]) {
                throw new Error(`Invalid middleware "${ name }"`);
            }

            return services[serviceName];
        });

        // Create a route that collects all of the route's dependencies at
        // request-time. This seems wasteful to do each request but it's a for
        // loop and some object lookups, and it allows us to do stuff like
        // automatically subclass the logger instance and give it the route
        // and request information.
        router[route.method.toLowerCase()](route.path, ...middlewares, (ctx, next) => {
            const deps = [];
            for (const name of route.deps) {
                switch (name) {
                    case "logger":
                        deps.push(services.logger.child({
                            "request_id": ctx.request.id,
                            "route": {
                                "method": route.method,
                                "path":   route.path,
                            },
                        }));
                    break;

                    default:
                        deps.push(services[name]);
                    break;
                }
            }

            return route.handler(...deps, ctx, next);
        });
    }

    const koaApp = new Koa();

    //WHY DOES THIS WORK BUT NOT THE ABOVE?
    koaApp.use(createKoaCorsMw({
            origin: "*",
            methods: [
                "PUT",
                "POST",
                "GET",
                "DELETE",
                "OPTIONS",
            ],
    }));
    koaApp.use(createKoaStatic(
        "/opt/api/swagger",
        {
            defer: true,
        }));
    koaApp.use(router.routes());

    return koaApp.callback();
};
