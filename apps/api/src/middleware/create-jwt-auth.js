const a = require("../utils/asyncify");

module.exports = function createJwtAuth (jwtService, logger, getCurrentTime) {
    logger = logger.child({
        middleware: "jwt_auth",
    });

    return a(function* jwtAuth (ctx, next) {
        try {
            ctx.state.token = jwtService.decode(getCurrentTime(), ctx.query.token);
        } catch (err) {
            logger.error(err);
            ctx.status = 403;
            ctx.body = "Failed to authenticate";
            return;
        }

        return (yield next());
    });
};
