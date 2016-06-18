const jwt = require('jwt-simple');

const decodeJwtToken = (token, secret) =>{
    return jwt.decode(token, secret);
};

module.exports = decodeJwtToken;