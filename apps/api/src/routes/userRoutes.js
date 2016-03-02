module.exports = (app, getClient) =>{
  app.post('/user', (req, res, next) => {
    getClient((err, client, done) => {
      if(err){
        next(err);
        return;
      }

      client.query('SELECT create_user($1, $2)', [req.body.email, req.body.password], (err) => {
        done();
        if (err){
          next(err);
          return;
        }
        else {
          res.send("All good");
        }
      });
    });
  });

  app.get('/user/:email', (req, res, next) => {
    getClient((err, client, done) => {
      if(err){
        next(err);
        return;
      }

      client.query('SELECT email, household_id FROM users WHERE email = $1', [req.params.email], (err, result) => {
        done();
        if (err){
          next(err);
          return;
        }
        else {
          if(result.rows.length == 1)
            res.send(result.rows[0]);
        }
      });
    });
  });
};
