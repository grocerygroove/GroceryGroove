const InvalidTokenError = require("../../errors/invalid-token-error");
const jwt = require('jwt-simple');

const decode = function (secret, expirationDate, token) {
    // If we get a null token give back a null decoded token.
    if (token == null) {
        return null;
    }

    const decodedToken = jwt.decode(token, secret);
    
    if (decodedToken.expiration_date <= expirationDate) {
        throw new InvalidTokenError(token, "Expired");
    }
    if (decodedToken.email === void(0)) {
        throw new InvalidTokenError(token, "Missing Email");
    }


    return decodedToken;
};

module.exports = decode;
