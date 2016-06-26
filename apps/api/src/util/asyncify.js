const co = require("co");

module.exports = function asyncify (generatorFunction) {
    return co.wrap(generatorFunction);
};
