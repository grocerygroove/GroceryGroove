const camelize = require("change-case").camelCase;
module.exports = function camelifyObject(obj) {
    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            obj[camelize (property)] = obj[property];
            delete obj[property];
        }
    }
    return obj;
};
