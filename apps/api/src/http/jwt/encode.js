const jwt = require("jwt-simple");
const moment = require("moment");

module.exports = function encode (secret, data, createdDate) {
    createdDate = createdDate || moment().valueOf();

    const payload = {
        data,
        created_date: createdDate,
    };

    return jwt.encode(payload, secret);
};
