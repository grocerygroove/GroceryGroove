const InvalidTokenError = require("../../errors/invalid-token-error");
const jwt = require('jwt-simple');

module.exports = function decode (secret, currentTime, token) {
    if (token == null) {
        return null;
    }

    const decodedToken = jwt.decode(token, secret);

    if (decodedToken.created_date >= currentTime) {
        throw new InvalidTokenError(token, "Expired");
    }

    return decodedToken;
};
