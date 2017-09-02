const Pool = require('pg').Pool;

module.exports = function makeDatabase({
  user,
  password,
  name,
  host,
  port,
}) {
  const pool = new Pool({
    user,
    password,
    database: name,
    port,
    host,
  });
  const connect = function connect () {
    return pool.connect()
      .then(client => {
        console.log(JSON.stringify(client, null, 2));
        return client;
      });
  };

  return {
    connect,
  };
};
