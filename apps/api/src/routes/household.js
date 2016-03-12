const jwtauth = require('../jwtauth.js');
module.exports = (app, radford) => {

  app.post('/household', [jwtauth] (req, res) =>{
    //Do something
  });

};
