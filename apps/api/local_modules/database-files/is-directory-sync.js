/* eslint-disable no-sync */

const statSync = require("fs").statSync;

module.exports = function isDirectory (path) {
    return statSync(path).isDirectory();
};
