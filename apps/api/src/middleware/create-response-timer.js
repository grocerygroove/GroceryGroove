/**
 * This middleware embraces side-effects and is therefore not truly testable.
 * I'm fine with that.
 */
const a = require("../utils/asyncify");
const hrtimeToMilliseconds = require("../utils/hrtime-to-milliseconds");

module.exports = function createResponseTimer () {
    return a(function* (ctx, next) {
        const startHrtime = process.hrtime();
        const retval = yield next();
        const durationHrtime = process.hrtime(startHrtime);

        ctx.response.set("X-Response-Time", `${ hrtimeToMilliseconds(durationHrtime) }ms`);
        return retval;
    });
};
