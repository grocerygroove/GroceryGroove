module.exports = function createJwtAuthMw (jwtService, logger) {
    logger = logger.child({
        middleware: "jwt_auth",
    });

    return (req, res, next) => {
        const token = req.query.token;
        try {
            req.token = jwtService.decode(Date.now(), token);
            next();
        } catch (err) {
            logger.info(err);
            req.end('Failed to authenticate', 403);
        }
    };
};
