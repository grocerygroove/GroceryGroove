const createHouseholdExtractor = require("../middleware/create-household-extractor");
const createJsonBodyParser = require("koa-json-body");
const createRouter = require("../http/create-router");
const Koa = require('koa');

const routes = [
    { path: "/users",          routerCreator: require("./routes/users")          },
    { path: "/households",     routerCreator: require("./routes/households")     },
    { path: "/login",          routerCreator: require("./routes/login")          },
    { path: "/categories",     routerCreator: require("./routes/categories")     },
    { path: "/quantity-types", routerCreator: require("./routes/quantity-types") },
    { path: "/grocery-lists",  routerCreator: require("./routes/grocery-lists")  },
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
