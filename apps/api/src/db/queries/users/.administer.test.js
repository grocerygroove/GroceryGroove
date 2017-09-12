require('dotenv').load();
global.Promise = require("bluebird");
const defaultUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");
const secondaryUser = require("../../../utils/secondary-test-user");


const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/set-primary-household", tap => {
  tap.test("set primary household", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const startHousehold = (await queries.users.getOne(db, logger, {
      userId: defaultUser.user_id,
    })).primary_household_id;

    //Add user to a different household
    await queries.users.createHouseholdUser(db, logger, {
      householdId: secondaryUser.primary_household_id,
      userId: defaultUser.user_id,
    });

    await queries.users.setPrimaryHousehold(db, logger, {
      householdId: secondaryUser.primary_household_id,
      userId: defaultUser.user_id,
    });

    const endHousehold = (await queries.users.getOne(db, logger, {
      userId: defaultUser.user_id,
    })).primary_household_id;

    tap.assert(startHousehold != endHousehold);

    await db.end();
  }));

  tap.end();
});
