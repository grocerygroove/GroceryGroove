const collapseGroup = require('koa-group-router/collapse-group');
const getDefaultSwaggerObject = () => ({
    swagger: "2.0",
    info: {
        title: "Grocery Groove API",
        version: "v1",
    },
    host: "localhost:18080",
    tags: [],
    paths: {},
    definitions: {},
});

module.exports = function createSwagger (rootGroup) {
    const swaggerObject = getDefaultSwaggerObject();

    collapseGroup(rootGroup).forEach((route) => {
        const firstSlashStripped = route.path.substring(route.path.indexOf("/")+1);
        const tagName = firstSlashStripped.indexOf("/") > -1 ? firstSlashStripped.substring(0, firstSlashStripped.indexOf("/")) : firstSlashStripped;
        route.method = route.method.toLowerCase();//This actually matters :(

        const swagTag = {
            name: tagName,
            description: `Methods involving ${tagName}`,
        };
        if (swaggerObject.tags.filter(x => {
            return x.name === swagTag.name || x.description === swagTag.description;
        }).length === 0) {
            swaggerObject.tags.push(swagTag);
        }

        /**
        * Koa does path variables with :name,
        * swagger does it with {name}...convert
        * for valid swagger
        */
        let routePath;
        routePath = route.path;
        if (routePath && routePath.indexOf(":") !== -1) {
            let pathValue;
            pathValue = routePath.substring(routePath.indexOf(":"));
            //Trim off any remaining path stuff
            pathValue = pathValue.indexOf("/") !== -1 ? pathValue.substring(0, pathValue.indexOf("/")) : pathValue;
            const variableName = pathValue.substring(pathValue.indexOf(":")+1);
            routePath = routePath.replace(pathValue, `{${variableName}}`);
        }

        const currentPath = routePath;
        if (!swaggerObject.paths[currentPath]) {
            swaggerObject.paths[currentPath] = {};
        }

        swaggerObject.paths[currentPath][route.method] = {
            parameters: [],
        };

        if (route.middlewares && route.middlewares.indexOf("jwtAuth") > -1) {
            //Add token parameter
            swaggerObject.paths[currentPath][route.method].parameters.push({
                name: "token",
                in: "query",
                description: "Auth token",
                required: true,
                type: "string",
            });
        }
        if (route.middlewares && route.middlewares.indexOf("householdExtractor") > -1) {
            //Add householdId parameter
            swaggerObject.paths[currentPath][route.method].parameters.push({
                name: "household_id",
                in: "query",
                description: "Household Identifier",
                required: true,
                type: "integer",
            });
        }

        if (route.parameters) {
            //Try to find body params
            const bodyParams = route.parameters.filter(o => {
                return o.in === "body";
            });
            if (bodyParams.length > 0) {
                //Need to create a schema object to contain all of the body params
                //then inject the reference to the newly created schema object as
                //as route parameter
                const paramName = `bodyparam${currentPath.replace(/\//ig, "-").replace(":", "_") + route.method}`;
                const parameter = {
                    name: paramName,
                    in: "body",
                    required: true,
                    schema: {
                        $ref: `#/definitions/${paramName}`,
                    },
                };
                //Add param to route params
                swaggerObject.paths[currentPath][route.method].parameters.push(parameter);
                //Generate the schema
                const schema = {
                    type: "object",
                    required: bodyParams.filter(o => o.required).map(o => o.name),
                    properties: {},
                };
                for (let i = 0, L = bodyParams.length; i < L; i++) {
                    schema.properties[bodyParams[i].name] = {
                        description: bodyParams[i].description,
                        type: bodyParams[i].type,
                        format: bodyParams[i].format,
                    };

                }

                //Insert the schema
                swaggerObject.definitions[paramName] = schema;
            }

            //Insert all non body params normally
            swaggerObject.paths[currentPath][route.method].parameters =
                swaggerObject.paths[currentPath][route.method].parameters.concat(
                    route.parameters.filter(o => o.in !== "body"));
        }

        if (route.responses) {
            Object.keys(route.responses).forEach((key) => {
                if (key === "200") {
                    route.responses[key].description = "Good";
                } else if (key === "400") {
                    route.responses[key].description = "Bad";
                } else if (key === "401") {
                    route.responses[key].description = "Insufficient Permissions";
                } else if (key === "403") {
                    route.responses[key].description = "Forbidden";
                }
            });
            swaggerObject.paths[currentPath][route.method].responses = route.responses;
        }

        //Tags
        swaggerObject.paths[currentPath][route.method].tags = [];
        swaggerObject.paths[currentPath][route.method].tags.push(tagName);

        if (route.produces) {
            swaggerObject.paths[currentPath][route.method].produces = route.produces;
        }

    });


    return swaggerObject;
};
