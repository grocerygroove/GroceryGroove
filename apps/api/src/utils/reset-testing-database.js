const a = require("./asyncify");
const execp = require("./execp");
const queries = require("../db/queries");
const defaultTestUser = require("./default-test-user");
const Pool = require('pg').Pool;
const secondaryTestUser = require("./secondary-test-user");


module.exports = (async function resetTestingDatabase () {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("must be in dev env to reset test db");
  }

  //Reset the database
  await execp(`/bin/migrate downtesting`);
  await execp(`/bin/migrate uptesting`);


  const logger = {
    info: () => {},
    child: () => { return logger; },
  };
  //Create test user
  const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
  });
  await queries.users.createUserAndHouseholdByEmail(db, logger, [
    defaultTestUser.email,
    defaultTestUser.password,
  ]);

  //Create test user
  await queries.users.createUserAndHouseholdByEmail(db, logger, [
    secondaryTestUser.email,
    secondaryTestUser.password,
  ]);

  await db.end();
});
