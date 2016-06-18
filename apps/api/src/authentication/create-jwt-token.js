const jwt = require('jwt-simple');

const createJwtToken = (secret) => {
    return (email) => {
        const expires = moment().add('days', 7).valueOf();
        const token = jwt.encode({
            iss: email,
            exp: expires
        }, secret); 
        return token;
    }
};

module.exports = createJwtToken;