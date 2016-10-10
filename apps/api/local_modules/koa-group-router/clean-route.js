"use strict";

module.exports = function cleanRoute (route) {
    if (!route.method) {
        throw new Error("missing method");
    }
    if (!route.handler) {
        throw new Error("missing handler");
    }

    return Object.assign({}, route, {
        method:      route.method.toUpperCase(),
        path:        route.path        || "/",
        middlewares: route.middlewares || [],
        handler:     route.handler,
    });
};
