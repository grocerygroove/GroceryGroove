const concatAll = require("./concat-all");

module.exports = function concat (...arrays) {
    return concatAll(arrays);
};
