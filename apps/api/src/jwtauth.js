const jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  if (token) {
    try
    {
      const decoded = jwt.decode(token, process.env.JWTSECRET);

      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
      }

      req.email = decoded.email;

    } catch (err) {
      return next();
      }
  } else {
    next();
  }
};
