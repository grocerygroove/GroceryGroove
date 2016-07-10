const a = require("../utils/asyncify");

module.exports = function createUserExtractor (logger) {
    logger = logger.child({
        middleware: "user-extractor",
    });

    return a(function* (ctx, next) {
        if (ctx.state.token.userId && ctx.state.token.userId.match(/^\d+$/)) {
            ctx.state.userId = parseInt(ctx.state.token.userId, 10);

            return (yield next());
        } else {
            logger.info({
                errorName: "Failed user_id check",
                householdId: ctx.state.token.userId,
            });
            ctx.status = 424;
            ctx.body = "Invalid user_id";

            return;
        }
    });
};
