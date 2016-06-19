/**
 * This file has a lot of processing code coupled to side-effect producing code.
 * This should really be separated. Also, better naming needed for this file.
 */
const decodeJwtToken = require("./decode-jwt-token");

const createJwtAuthMw = function (logger, secret) {
    logger = log.child({
        middleware: "jwt_auth",
    });

    return (req, res, next) => {
        const token = req.query.token;
        try {
            req.token = decodeJwtToken(secret, Date.now(), token);
        } catch (err) {
            logger.info(err);
        }
    };
};

module.exports = createJwtAuthMw;
