const express = require('express');
const bodyParser = require('body-parser');

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
        jsonBodyParser: bodyParser.json(),
    });

    var expressApp = express();
    for (const { path, routerCreator } of routes) {
        expressApp.use(path, routerCreator(services));
    }

    return expressApp;
};
