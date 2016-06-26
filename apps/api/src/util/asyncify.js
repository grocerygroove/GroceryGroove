const co = require("co");

const asyncify = function (generatorFunction) {
    return co.wrap(generatorFunction);
};

module.exports = asyncify;
