const a = require("../utils/asyncify");

module.exports = function createHouseholdExtractor (logger) {
    logger = logger.child({
        middleware: "household-extractor",
    });

    return a(function* (ctx, next) {
        if (ctx.query.household_id && ctx.query.household_id.match(/^\d+$/)) {
            ctx.state.householdId = parseInt(ctx.query.household_id, 10);

            return (yield next());
        } else {
            logger.info({
                errorName: "Failed household_id check",
                householdId: ctx.query.household_id,
            });
            ctx.status = 424;
            ctx.body = "Invalid household_id";

            return;
        }
    });
};
