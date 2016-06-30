const jwt = require("jwt-simple");
const moment = require("moment");

module.exports = function encode (secret, email, expirationDate) {
    expirationDate = expirationDate || moment().add(7, "days").valueOf();

    const payload = {
        email,
        expiration_date: expirationDate.toString(),
    };

    return jwt.encode(payload, secret);
};
