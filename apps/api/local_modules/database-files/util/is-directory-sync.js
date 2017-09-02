/* eslint-disable no-sync */

const statSync = require("fs").statSync;

module.exports = function isDirectorySync (path) {
    return statSync(path).isDirectory();
};
