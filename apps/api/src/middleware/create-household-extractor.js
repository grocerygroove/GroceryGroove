const a = require("../utils/asyncify");

module.exports = function createHouseholdExtractor (logger) {
    logger = logger.child({
        "middleware": "household-extractor",
    });

    const retval = a(function* householdExtractor (ctx, next) {
        if (ctx.query.household_id && ctx.query.household_id.match(/^\d+$/)) {
            ctx.state.householdId = parseInt(ctx.query.household_id, 10);

            yield next();
        } else {
            logger.error({
                "error_name":   "Failed household_id check",
                "household_id": ctx.query.household_id,
                "request_id":  ctx.request.id,
            });

            ctx.status = 424;
            ctx.body = "Invalid household_id";
        }
    });

    retval.swagger = module.exports.swagger;
    return retval;
};

module.exports.swagger = {
    parameters: [
        {
            name: "household_id",
            in: "path",
            required: true,
            type: "integer",
        },
    ],
};
