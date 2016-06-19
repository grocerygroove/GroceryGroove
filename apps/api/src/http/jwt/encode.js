const jwt = require("jwt-simple");
const moment = require("moment");

const encode = function (secret, email) {
    const payload = {
        email,
        expiration_date: moment().add(7, "days").valueOf(),
    };

    return jwt.encode(payload, secret);
};

module.exports = encode;
