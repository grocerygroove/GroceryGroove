"use strict";

const defaultOnInjection = function (ctx, next) {
    return next();
};

module.exports = function createServiceInjector (services, onInjection) {
    const routeLookup = new WeakMap();

    if (onInjection == null) {
        onInjection = defaultOnInjection;
    }

    return function injectServices (ctx, next) {
        if (!routeLookup.has(ctx.route)) {
            const routeServices = {};
            for (const name of ctx.route.services) {
                if (typeof services[name] === "undefined") {
                    throw new Error(`Unknown service specified: "${ name }"`);
                }
                routeServices[name] = services[name];
            }
            routeLookup.set(route, ctx.services);
        }

        ctx.services = routeLookup.get(ctx.route);
        return onInjection(ctx, next);
    };
};
