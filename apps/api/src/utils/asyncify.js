const bluebird = require("bluebird");

module.exports = function asyncify (generatorFunction) {
    return bluebird.coroutine(generatorFunction);
};
