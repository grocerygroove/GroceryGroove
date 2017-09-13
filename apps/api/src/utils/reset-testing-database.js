const execp = require("./execp");
const defaultTestUser = require("./default-test-user");
const deviceIdUser = require("./device-id-test-user");
const Pool = require('pg').Pool;
const secondaryTestUser = require("./secondary-test-user");
const transactions = require("../db/transactions");


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
  //Add primary user
  await transactions.users.createUserAndHouseholdByEmail(db, logger, {
    email: defaultTestUser.email,
    nickname: defaultTestUser.nickname,
    password: defaultTestUser.password,
  });
  //Add secondary user
  await transactions.users.createUserAndHouseholdByEmail(db, logger, {
    email: secondaryTestUser.email,
    nickname: secondaryTestUser.nickname,
    password: secondaryTestUser.password,
  });
  //Add device id user
  await transactions.users.createUserAndHouseholdByDeviceIdentifier(db, logger, {
    deviceIdentifier: deviceIdUser.device_identifier,
    nickname: deviceIdUser.nickname,
  });

  await db.end();
});
