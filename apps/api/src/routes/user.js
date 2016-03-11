module.exports = (app, radford) => {

  app.get('user', (req, res) =>{
    const email = req.param("email");
    const pass = req.param("password");


    radford.require('db').then((db)=>{
      db.using((client) => {
        return client.queries.validateuser(email, password);
      });
    });
  });

};
