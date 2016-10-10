const a = require("../utils/asyncify");

module.exports = function createUserIdExtractor (logger) {
    logger = logger.child({
        "middleware": "extract_user_id",
    });

    const retval = a(function* extractUserId (ctx, next) {
        if (!ctx.state.token || !ctx.state.token.data || !ctx.state.token.data.user_id) {
            logger.error({
                "error_name": "user_id missing from token, possible forgot to use jwtAuthMw before this one?",
                "request_id": ctx.request.id,
                "token": ctx.state.token,
            });

            ctx.status = 500;
            return;
        }

        ctx.state.userId = ctx.state.token.data.user_id;
        yield next();
    });

    retval.swagger = module.exports.swagger;
    return retval;
};

module.exports.swagger = {
};
