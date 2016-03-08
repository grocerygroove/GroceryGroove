global.Promise = require("bluebird");
const bunyan = require("bunyan");
const makeDatabase = require("./db/make-database");
const Radford = require("radford");
//const Server = require("./server");

try{
  const radford = new Radford({
      definitions: {
          db: {
              cache: true,
              dependencies: ["logger"],
              create: ({ logger }) => {
                  return makeDatabase(logger, process.env.DB_CONN_STRING);
              },
          },
          logger: {
              cache: ({ name }) => name,
              create: ({}, { name }) => {
                  if (process.env.NODE_ENV === "production") {
                      return bunyan.createLogger({
                          name,
                      });
                  } else {
                      return bunyan.createLogger({
                          name,
                          src: true,
                      });
                  }
              },
          },
      },
  });

  radford.require(['db']).then(()=>{
    console.log(arguments);
  })
  .catch((e)=>{
    console.log(e);
    console.log("name"+e.message);
    console.log(e.stack);
  });
}
catch(e)
{
  console.log(e);
  console.log("name"+e.message);
  console.log(e.stack);
}
