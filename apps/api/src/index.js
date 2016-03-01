//DB setup
const pg = require('pg');
const client = new pg.Client({
  user: 'grocerygroove_owner',
  password: 'oq9urqwe09r8yr89q432yr8huirhgjbvh',
  database: 'grocerygroove',
  host: 'localhost',
  port: '5432'
});

//Express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

//Routes
app.post('/user', function(req, res){
  client.connect();
  client.query('SELECT create_user($1, $2)', [req.body.email, req.body.password], function(err){
    if(err)
      console.log(err);
    res.send("Failed");
  });
});

app.listen(8080);
