const decode = require("./decode");
const encode = require("./encode");

module.exports = function createService (secret) {
    return {
        encode: (...args) => encode(secret, ...args),
        decode: (...args) => decode(secret, ...args),
    };
};
