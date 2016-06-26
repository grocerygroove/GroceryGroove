const express = require("express");

module.exports = function createRouter (cb) {
    const retval = express.Router();

    if (cb) {
        cb(retval);
    }

    return retval;
};
