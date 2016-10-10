"use strict";

const collapseGroup = require("./collapse-group");
const createKoaRouter = require("koa-router");
const createRouteInjector = require("./create-route-injector");

module.exports = function createMiddleware (group, middlewares) {
    const router = createKoaRouter();

    const routes = collapseGroup(group);
    for (const route of routes) {
        const method = route.method.toLowerCase();
        const path = route.path;
        if (!router[method]) {
            throw new Error(`invalid method "${ route.method }"`);
        }

        const middlewares = [].concat(
            [ createRouteInjector(route) ],
            route.middlewares.map(name => {
                if (!middlewares[name]) {
                    throw new Error(`Invalid middleware "${ name }"`);
                }

                return middlewares[name];
            })
        );

        router[method](path, ...middlewares, route.handler);
    }

    return router.routes();
};
