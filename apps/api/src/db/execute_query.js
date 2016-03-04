module.exports = () => {
  const stmt = arguments[0];//First arg is the query stmt
  var params = Array.prototype.slice.call(arguments, 1);
  if(typeof params[params.length-1] === "function")
    var callback = params.pop();
  else
    var callback = () => {};//Empty function

  console.log(params.toString());
  console.log(callback.toString());

  const pg = require('pg');
  const getClient = function(cb){
    pg.connect(require('./config.json'), cb);
  };

  getClient((err, client, done) => {
    if(err){
      next(err);
      return;
    }

    client.query(stmt, params, (err, result) => {
      done();
      if (err){
        console.log(err);
        next(err);
        return;
      }
      else {
        callback(result);
      }
    });
  });
};
