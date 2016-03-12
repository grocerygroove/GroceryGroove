module.exports = (radford) => {
  //Express setup
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  app.use(bodyParser.json());

  //Routes
  require('./routes/userlogin')(app,radford);

  radford.require(['db']).then(()=>{
    console.log(arguments);
  });

  app.use((error, req, res, next) => {
      res.sendStatus(503);
      console.log(error);
  });

  app.listen(8080);
};
