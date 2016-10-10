"use strict";

const collapseGroup = require("./collapse-group");

module.exports = function getRoute (rootGroup, method, path) {
    for (const route of collapseGroup(rootGroup)) {
        if (method.toUpperCase() === route.method && path === route.path) {
            return route;
        }
    }
};
