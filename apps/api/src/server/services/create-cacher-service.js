const a = require("../../utils/asyncify");

module.exports = (client) => {
    return {
        set: a(function* (key, value) {
            let valueToCache;
            if (typeof value === 'object') {
                valueToCache = JSON.stringify(value);
            } else if (typeof value === "string" || typeof value === "number") {
                valueToCache = value;
            } else {
                throw new Error(`Invalid type to cache: ${typeof value}`);
            }
            yield client.setAsync(key, valueToCache);
        }),
        get: a(function* (key) {
            const retrievedValue = yield client.getAsync(key);

            //Try to parse the string as an object
            try {
                return JSON.parse(retrievedValue);
            } catch (e) {
                //If that doesn't work return the value
                return retrievedValue;
            }
        }),
        del: a(function* (key) {
            yield client.delAsync(key);
        }),
        delMulti: a(function* (keys) {
            yield client.delAsync(keys);
        }),
    };
};
