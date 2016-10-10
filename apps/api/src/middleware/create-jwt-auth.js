const a = require("../utils/asyncify");

module.exports = function createJwtAuth (jwtService, logger, getCurrentTime) {
    logger = logger.child({
        "middleware": "auth_jwt",
    });

    const retval = a(function* authJwt (ctx, next) {
        try {
            ctx.state.token = jwtService.decode(getCurrentTime(), ctx.query.token);
        } catch (error) {
            logger.error({
                "error": error,
                "error_name": "Bad Token",
                "request_id": ctx.request.id,
            });

            ctx.status = 403;
            ctx.body = "Failed to authenticate";
            return;
        }

        yield next();
    });

    retval.swagger = module.exports.swagger;
    return retval;
};

module.exports.swagger = {
    parameters: [
        {
            name: "token",
            in: "path",
            required: true,
            type: "string",
        },
    ],
}
