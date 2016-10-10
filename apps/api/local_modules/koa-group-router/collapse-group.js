"use strict";

const cleanGroup = require("./clean-group");
const typeofChild = require("./typeof-child");

const joinPaths = (...paths) => `/${
    paths
    .map(path => path.replace(/^\//, ''))
    .map(path => path.replace(/\/$/, ''))
    .filter(path => path)
    .join("/")
}`;

const merge = function (parent, child) {
    const retval = {};

    for (const key of Object.keys(parent).filter(k => k !== "routes")) {
        retval[key] = parent[key];
    }

    for (const key of Object.keys(child).filter(k => k !== "routes")) {
        if (0) {
        } else if (Array.isArray(retval[key]) && Array.isArray(child[key])) {
            retval[key] = [].concat(retval[key], child[key]);

        } else if (1
            && (child[key] != null)
            && (retval[key] != null)
            && (typeof child[key] === "object")
            && (typeof retval[key] === "object")
        ) {
            retval[key] = merge(retval[key], child[key]);

        } else {
            retval[key] = child[key];
        }
    }

    return retval;
};

module.exports = function collapseGroup (group) {
    if (typeofChild(group) !== "group") {
        throw new Error(`expected group, got "${ typeofChild(group) }"`);
    }

    group = cleanGroup(group);
    const routes = [].concat(...group.routes.map(item => {
        if (typeofChild(item) === "route") {
            return [ item ];

        } else if (typeofChild(item) === "group") {
            return collapseGroup(item);

        } else {
            throw new Error(`expected valid item, got "${ typeofChild(item) }"`);
        }
    }));

    return routes.map(route => Object.assign(merge(group, route), {
        path: joinPaths(group.path, route.path),
    }));
};
