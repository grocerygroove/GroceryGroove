const a = require("../utils/asyncify");

module.exports = function createUserExtractor (logger) {
    logger = logger.child({
        "middleware": "user-extractor",
    });

    return a(function* userExtractor (ctx, next) {
        if (!ctx.state.token || !ctx.state.token.data || !ctx.state.token.data.userId) {
            logger.error({
                "error_name": "userId missing from token, possible forgot to use jwtAuthMw before this one?",
                "request_id": ctx.request.id,
                "token": ctx.state.token,
            });

            ctx.status = 500;
            return;
        }

        ctx.state.userId = ctx.state.token.data.userId;
        yield next();
    });
};
