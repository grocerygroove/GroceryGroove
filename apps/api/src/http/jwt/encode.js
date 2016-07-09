const jwt = require("jwt-simple");
const moment = require("moment");

module.exports = function encode (secret, userid, createdDate) {
    createdDate = createdDate || moment().valueOf();

    const payload = {
        userid,
        created_date: createdDate,
    };

    return jwt.encode(payload, secret);
};
