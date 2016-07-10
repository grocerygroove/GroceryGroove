const cleanGroup = require("./clean-group");
const concat = require("../../utils/concat");
const concatAll = require("../../utils/concat-all");
const joinPaths = require("./join-paths");
const typeofChild = require("./typeof-child");

module.exports = function collapseGroup (group) {
    if (typeofChild(group) !== "group") {
        throw new Error(`expected group, got "${ typeofChild(group) }"`);
    }

    group = cleanGroup(group);
    routes = concatAll(group.routes.map(item => {
        if (typeofChild(item) === "route") {
            return [ item ];

        } else if (typeofChild(item) === "group") {
            return collapseGroup(item);

        } else {
            throw new Error(`expected valid item, got "${ typeofChild(item) }"`);
        }
    }));

    routes = routes.map(route => ({
        method:      route.method,
        path:        joinPaths(group.path, route.path),
        middlewares: concat(group.middlewares, route.middlewares),
        deps:        concat(group.deps, route.deps),
        handler:     route.handler,
    }));

    return routes;
};
