const cleanRoute = require("./clean-route");
const typeofChild = require("./typeof-child");

module.exports = function cleanGroup (group) {
    return {
        path:        group.path || "/",
        middlewares: group.middlewares || [],
        deps:        group.deps || [],
        routes:      group.routes.map(item => {
            if (typeofChild(item) === "group") {
                return cleanGroup(item);
            } else if (typeofChild(item) === "route") {
                return cleanRoute(item);
            } else {
                throw new Error(`expected valid item, got "${ typeofChild(item) }"`);
            }
        }),
    };
};
