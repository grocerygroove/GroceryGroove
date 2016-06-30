const a = require("../utils/asyncify");

module.exports = function createJwtAuth (jwtService, logger, getCurrentTime) {
    logger = logger.child({
        middleware: "jwt_auth",
    });

    return a(function* (ctx, next) {
        const token = ctx.query.token;
        try {
            ctx.state.token = jwtService.decode(getCurrentTime(), token);
            return yield next();
        } catch (err) {
            logger.info(err);
            ctx.status = 403;
            ctx.body = "Failed to authenticate";
        }
    });
};
