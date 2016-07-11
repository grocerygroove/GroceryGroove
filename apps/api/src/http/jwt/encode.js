const jwt = require("jwt-simple");

module.exports = function encode (secret, data, createdDate) {
    createdDate = createdDate;

    const payload = {
        data,
        created_date: createdDate,
    };

    return jwt.encode(payload, secret);
};
