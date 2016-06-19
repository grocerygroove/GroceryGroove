const decode = require("./decode");
const encode = require("./encode");

const createService = function (secret) {
    return {
        encode: (...args) => encode(secret, ...args),
        decode: (...args) => decode(secret, ...args),
    };
};

module.exports = createService;
