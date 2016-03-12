const jwtauth = require('../jwtauth.js');
module.exports = (app, radford) => {

  app.all('/user/*', jwtauth);//Validate token for every path in these routes

  //return household info about a user (if they are validated to have access)
  app.get('/user/:email', (req, res) =>{
    if(req.email !== req.params.email)
      res.end('Insufficient Access', 401);

    //The token's email and the requested email match up. Lets get and return the info
    radford.require(['db']).then((db)=>{
      db.using((client) => {
        const queryResults = client.queries.getuser(req.email);
        if(queryResults){
          res.json(queryResults);
        }
        else {
          res.end('Invalid Request', 400);//
        }
      });
    });
  });
};
