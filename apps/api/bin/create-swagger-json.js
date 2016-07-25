#!/usr/bin/env nodejs

const rootGroup = require("../src/server/routes");

const swaggerObject = {
    swagger: "2.0",
    info: {
        title: "Grocery Groove API",
        version: "v1",
    },
    paths: {},
};

rootGroup.routes.forEach((obj) => {
    obj.routes.forEach((route) => {
        const currentPath = `${obj.path}${(!route.path) ? "" : route.path}`;
        if (!swaggerObject.paths[currentPath]) {
            swaggerObject.paths[currentPath] = {};
        }

        swaggerObject.paths[currentPath][route.method] = {
            parameters: [],
        };

        if (obj.middlewares && obj.middlewares.indexOf("jwtAuth") > -1) {
            //Add token parameter
            swaggerObject.paths[currentPath][route.method].parameters.push({
                name: "token",
                in: "path",
                description: "Auth token",
                required: "true",
                type: "string",
            });
        }
        if (obj.middlewares && obj.middlewares.indexOf("householdExtractor") > -1) {
            //Add householdId parameter
            swaggerObject.paths[currentPath][route.method].parameters.push({
                name: "householdId",
                in: "path",
                description: "Household Identifier",
                required: "true",
                type: "integer",
            });
        }

        if (route.parameters) {
            swaggerObject.paths[currentPath][route.method].parameters =
                swaggerObject.paths[currentPath][route.method].parameters.concat(route.parameters);
        }

        if (route.responses) {
            swaggerObject.paths[currentPath][route.method].responses = route.responses;
        }

        if (route.produces) {
            swaggerObject.paths[currentPath][route.method].produces = route.produces;
        }

    });
});

console.log(JSON.stringify(swaggerObject, null, 4));
