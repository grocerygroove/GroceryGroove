const InvalidTokenError = require("../../errors/invalid-token-error");
const jwt = require('jwt-simple');

module.exports = function decode (secret, currentTime, token) {
    // If we get a null token give back a null decoded token.
    if (token == null) {
        return null;
    }

    const decodedToken = jwt.decode(token, secret);

    if (decodedToken.created_date >= currentTime) {
        throw new InvalidTokenError(token, "Expired");
    }
    if (decodedToken.email === void(0)) {
        throw new InvalidTokenError(token, "Missing Email");
    }


    return decodedToken;
};
