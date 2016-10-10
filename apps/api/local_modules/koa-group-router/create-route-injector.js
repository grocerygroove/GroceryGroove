"use strict";

module.exports = function createRouteInjector (route) {
    return function injectRoute (ctx, next) {
        ctx.route = route;

        return next();
    };
};
