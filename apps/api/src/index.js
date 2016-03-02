//DB setup
const pg = require('pg');
const connString = "postgres://grocerygroove_owner:oq9urqwe09r8yr89q432yr8huirhgjbvh@localhost:5432/grocerygroove";
const getClient = function(cb){
  pg.connect(connString, cb);
};


//Express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

//Routes
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

app.get('/user/household_id', (req, res, next) => {
  getClient((err, client, done) => {
    if(err){
      next(err);
      return;
    }

    client.query('SELECT household_id FROM users WHERE email = $1', [req.body.email], (err, result) => {
      done();
      if (err){
        next(err);
        return;
      }
      else {
        res.send(result);
      }
    });
  });
});




app.use((error, req, res, next) => {
    res.sendStatus(503);
    console.log(error);
});

app.listen(8080);
