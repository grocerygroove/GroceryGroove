const jwtauth = require('../jwtauth.js');
module.exports = (app, radford) => {

  app.all('/household/*', jwtauth);
  app.post('/household', (req, res) =>{
    
  });

};
