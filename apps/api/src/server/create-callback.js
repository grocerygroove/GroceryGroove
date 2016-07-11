const applyDefaults = require("../utils/apply-defaults");
const collapseRoutingGroup = require("./route-tools/collapse-group");
const createUserExtractor = require("../middleware/create-user-extractor");
const createHouseholdExtractor = require("../middleware/create-household-extractor");
const createJsonBodyParser = require("koa-json-body");
const createResponseTimer = require("../middleware/create-response-timer");
const createKoaRouter = require("koa-router");
const Koa = require('koa');
const rootGroup = require("./routes");

module.exports = function createCallback (services) {
    services = applyDefaults(services, {
        householdExtractorMw: createHouseholdExtractor(services.logger),
        jsonBodyParserMw:     createJsonBodyParser(),
        responseTimerMw:      createResponseTimer(),
        userExtractorMw:      createUserExtractor(services.logger),
    });

    const getService = (name) => {
        if (services[name]) {
            return services[name];
        } else {
            throw new Error(`Invalid service name "${ name }"`);
        }
    };

    const router = createKoaRouter();
    for (const route of collapseRoutingGroup(rootGroup)) {
        const method      = route.method.toLowerCase();
        const path        = route.path;
        const middlewares = route.middlewares.map(middleware => getService(`${ middleware }Mw`));
        const deps        = route.deps.map(getService);
        const handler     = (ctx, next) => route.handler(...deps, ctx, next);

        router[method](path, ...middlewares, handler);
    }

    const koaApp = new Koa();
    koaApp.use(router.routes());

    return koaApp.callback();
};
