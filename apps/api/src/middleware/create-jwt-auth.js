const a = require("../utils/asyncify");

module.exports = function createJwtAuth (jwt, logger) {
    logger = logger.child({
        middleware: "jwt_auth",
    });

    return a(function* (ctx, next) {
        const token = req.query.token;
        try {
            ctx.state.token = jwt.decode(Date.now(), token);
            return yield next();
        } catch (err) {
            logger.info(err);
            ctx.status = 403;
            ctx.body = "Failed to authenticate";
        }
    });
};
