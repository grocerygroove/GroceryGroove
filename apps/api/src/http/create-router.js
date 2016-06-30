const router = require("koa-router");

module.exports = function createRouter (cb) {
    const retval = router();

    if (cb) {
        cb(retval);
    }

    return retval;
};
