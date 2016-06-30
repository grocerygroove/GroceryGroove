const a = require("../utils/asyncify");

module.exports = function createJwtAuth (jwtService, logger, getTime) {
    logger = logger.child({
        middleware: "jwt_auth",
    });

    return a(function* (ctx, next) {
        const token = ctx.query.token;
        try {
            ctx.state.token = jwtService.decode(getTime(), token);
            return yield next();
        } catch (err) {
            logger.info(err);
            ctx.status = 403;
            ctx.body = "Failed to authenticate";
        }
    });
};
