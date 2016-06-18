/**
 * This file has a lot of processing code coupled to side-effect producing code.
 * This should really be separated. Also, better naming needed for this file.
 */
const extractJwtToken = require("../http/extract-jwt-token");
const jwt = require('jwt-simple');

const createJWTAuth = (jwtsecret) =>{
  return (req, res, next) => {
      const token = extractJwtToken(req);
      if (token) {
        try
        {
          const decoded = jwt.decode(token, jwtsecret);

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
};

module.exports = createJWTAuth;
