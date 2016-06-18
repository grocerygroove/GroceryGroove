const extractJwtToken = function (res) {
    return (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
};

module.exports = extractJwtToken;
