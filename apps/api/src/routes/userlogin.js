module.exports = (app, radford) => {

  app.post('/userlogin', (req, res) =>{
    const email = req.body.email;
    const pass = req.body.password;


    radford.require(['db']).then((db)=>{
      db.using((client) => {
        if(client.queries.validateuser(email, password))//We have a vaild user
        {
          //Return a JWT token
          const expires = moment().add('days', 7).valueOf();
          const token = jwt.encode({
            iss: email,
            exp: expires
          }, process.env.JWTSECRET);

          res.json({
            token : token,
            expires: expires,
            email: email
          });
          return;
        }
      });
      //If we make it here, we didn't validate the user
      res.json({
        error: 'Invalid Username or Password'
      });
    });
  });
};
