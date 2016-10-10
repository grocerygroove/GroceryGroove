"use strict";

module.exports = function createServiceInjector (services, onInjection) {
    if (onInjection == null) {
        onInjection = function () {};
    }

    return function injectServices (ctx, next) {
        ctx.services = {}
        for (const name of ctx.route.services) {
            ctx.services[name] = services[name];
        }
        onInjection(ctx);

        return next();
    };
};
