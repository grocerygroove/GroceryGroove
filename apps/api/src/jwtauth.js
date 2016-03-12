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
      if(typeof req.email === "undefined")
        res.end('Invalid token', 400);//If they don't have a valid token, fail

      req.email = decoded.email;
      next();

    } catch (err) {
      return next();
      }
  } else {
    res.end('Invalid token', 400);//If they don't have a valid token, fail
  }
};
