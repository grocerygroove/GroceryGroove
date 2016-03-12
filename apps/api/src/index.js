global.Promise = require("bluebird");
require('dotenv').config();
const bunyan = require("bunyan");
const makeDatabase = require("./db/make-database");
const Radford = require("radford");


try{
  const radford = new Radford({
      definitions: {
          db: {
              cache: true,
              dependencies: ["logger"],
              create: ({ logger }) => {
                  return makeDatabase(logger, process.env.DBCONNSTRING);
              },
          },
          logger: {
              cache: ({ name }) => name,
              dependencies: ['db'],
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

  require("./server")(radford);

  const args = ['db'];
  radford.require(args).then(()=>{
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
