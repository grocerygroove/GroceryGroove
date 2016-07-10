const a = require("../utils/asyncify");

module.exports = function createUserExtractor (logger) {
    logger = logger.child({
        middleware: "user-extractor",
    });

    return a(function* (ctx, next) {
        if (ctx.state.token.data.userId && ctx.state.token.data.userId.match(/^\d+$/)) {
            ctx.state.userId = parseInt(ctx.state.token.data.userId, 10);

            return (yield next());
        } else {
            logger.info({
                errorName: "Failed user_id check",
                userId: ctx.state.token.data.userId,
            });
            ctx.status = 424;
            ctx.body = "Invalid user_id";

            return;
        }
    });
};
