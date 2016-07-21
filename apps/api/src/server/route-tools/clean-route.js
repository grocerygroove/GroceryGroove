module.exports = function cleanRoute (route) {
    if (!route.method) {
        throw new Error("missing method");
    }

    return {
        method:      route.method.toUpperCase(),
        path:        route.path || "/",
        middlewares: route.middlewares || [],
        deps:        route.deps || [],
        handler:     route.handler,
    };
};
