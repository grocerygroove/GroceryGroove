const tokenDecoder = require("./decode-jwt-token");

const getTokenIdentifier = (secret) => {
    return (token) => {
        const decoded = tokenDecoder(token, secret);
        return decoded.email;
    };
};

module.exports = getTokenIdentifier;