module.exports = (app, getClient) =>{
  app.get('/household/:id', (req, res, next) => {
    getClient((err, client, done) => {
      if(err){
        next(err);
        return;
      }

      client.query('SELECT id, name FROM households WHERE id = $1', [req.params.id], (err, result) => {
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
