const koa = require('koa');
const createJsonBodyParser = require("koa-json-body");

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
    services = Object.assign(services, {
        jsonBodyParser: createJsonBodyParser(),
    });

    var koaApp = koa();
    for (const { path, routerCreator } of routes) {
        koaApp.use(path, routerCreator(services));
    }

    return koaApp.callback();
};
