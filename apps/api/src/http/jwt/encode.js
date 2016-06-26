const jwt = require("jwt-simple");
const moment = require("moment");

module.exports = function encode (secret, email) {
    const payload = {
        email,
        expiration_date: moment().add(7, "days").valueOf(),
    };

    return jwt.encode(payload, secret);
};
