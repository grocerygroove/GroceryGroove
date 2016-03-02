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
require('./routes/userRoutes.js')(app,getClient);
require('./routes/householdRoutes.js')(app,getClient);



app.use((error, req, res, next) => {
    res.sendStatus(503);
    console.log(error);
});

app.listen(8080);
