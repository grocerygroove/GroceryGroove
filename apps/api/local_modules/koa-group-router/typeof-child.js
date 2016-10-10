"use strict";

module.exports = function typeofChild (child) {
    if (!child.routes && child.handler) {
        return "route";
    } else if (child.routes && !child.handler) {
        return "group";
    } else {
        return typeof(child);
    }
};
