const createHouseholdExtractor = require("../middleware/create-household-extractor");
const createJsonBodyParser = require("koa-json-body");
const createRouter = require("../http/create-router");
const Koa = require('koa');

/**
 * Put these routes in order of most-used to least-used, as each incoming
 * request will scan the entire list before finding the route.
 */
const routes = [
    { path: "/grocery-lists",  routerCreator: require("./routes/grocery-lists")  },
    { path: "/households",     routerCreator: require("./routes/households")     },
    { path: "/categories",     routerCreator: require("./routes/categories")     },
    { path: "/quantity-types", routerCreator: require("./routes/quantity-types") },
    { path: "/login",          routerCreator: require("./routes/login")          },
    { path: "/signup",         routerCreator: require("./routes/signup")         },
];

module.exports = function createCallback (services) {
    if (typeof services !== "object") {
        throw new Error("services must be map");
    }
    if (!services.logger) {
        throw new Error("missing logger");
    }
    if (!services.db) {
        throw new Error("missing db");
    }
    services = Object.assign(
        {
            householdExtractorMw: createHouseholdExtractor(services.logger),
            jsonBodyParserMw: createJsonBodyParser(),
        },
        services
    );

    const koaApp = new Koa();

    // I really don't like this. I need to fully investigate routing in koa
    // but for now this will work.
    koaApp.use(createRouter(r => {
        for (const { path, routerCreator } of routes) {
            const router = routerCreator(services);
            r.use(path, router.routes());
        }
    }).routes());

    return koaApp.callback();
};
