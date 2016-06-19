const createJwtAuthMw = function (jwt, logger) {
    logger = log.child({
        middleware: "jwt_auth",
    });

    return (req, res, next) => {
        const token = req.query.token;
        try {
            req.token = jwt.decode(Date.now(), token);
        } catch (err) {
            logger.info(err);
        }
    };
};

module.exports = createJwtAuthMw;
