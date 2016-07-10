const a = require("../utils/asyncify");

module.exports = function createUserExtractor (logger) {
    logger = logger.child({
        middleware: "user-extractor",
    });

    return a(function* (ctx, next) {
        if (!ctx.state.token || !ctx.state.token.data.userId) {
            logger.info({
                errorName: "userId missing from token, possible forgot to use jwtAuthMw before this one?",
                token: ctx.state.token,
            });

            ctx.status = 500
            return;
        }

        ctx.state.userId = ctx.state.token.data.userId;
        return (yield next());
    });
};
