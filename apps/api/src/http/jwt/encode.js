const jwt = require("jwt-simple");
const moment = require("moment");

module.exports = function encode (secret, email, createdDate) {
    createdDate = createdDate || moment().valueOf();

    const payload = {
        email,
        created_date: createdDate,
    };

    return jwt.encode(payload, secret);
};
