const express = require('express');
const bodyParser = require('body-parser');

const routes = [
    { path: "/users",           routerCreator: require("./routes/users")            },
    { path: "/households",      routerCreator: require("./routes/households")       },
    { path: "/login",           routerCreator: require("./routes/login")            },
    { path: "/categories",      routerCreator: require("./routes/categories")       },
    { path: "/quantity-types",  routerCreator: require("./routes/quantity-types")   },
];

const createCallback = function (services) {
    if (!services.logger) {
        throw new Error("missing logger");
    }
    if (!services.db) {
        throw new Error("missing db");
    }

    var expressApp = express();

    expressApp.use(bodyParser.json());

    for (let { path, routerCreator } of routes) {
        expressApp.use(path, routerCreator(services));
    }

    expressApp.use((error, req, res, next) => {
        res.sendStatus(503);
        services.logger.error(error);
    });

    return expressApp;
};

module.exports = createCallback;
