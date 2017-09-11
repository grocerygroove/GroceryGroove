require('dotenv').load();
global.Promise = require("bluebird");
const defaultUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const secondaryUser = require("../../../utils/secondary-test-user");
const tap = require("tap");

tap.test("db/queries/users/remove-houshold-user", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  tap.test("household admin can remove user", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add user to other user's household
    await queries.users.createHouseholdUser(db, logger, {
      householdId: defaultUser.primary_household_id,
      userId: secondaryUser.user_id,
    });

    const deletedCount = parseInt(await queries.users.removeHouseholdUser(db, logger, {
      userId: defaultUser.user_id,
      householdId: defaultUser.primary_household_id,
      userIdToDelete: secondaryUser.user_id,
    }));


    tap.strictSame(deletedCount, 1);
    await db.end();
  }));

  tap.test("user can remove themself", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add user to other user's household
    await queries.users.createHouseholdUser(db, logger, {
      householdId: defaultUser.primary_household_id,
      userId: secondaryUser.user_id,
    });

    const deletedCount = parseInt(await queries.users.removeHouseholdUser(db, logger, {
      userId: secondaryUser.user_id,
      householdId: defaultUser.primary_household_id,
      userIdToDelete: secondaryUser.user_id,
    }));


    tap.strictSame(deletedCount, 1);
    await db.end();
  }));

  tap.test("user cannot remove someone else", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add user to other user's household
    await queries.users.createHouseholdUser(db, logger, {
      householdId: defaultUser.primary_household_id,
      userId: secondaryUser.user_id,
    });

    const deletedCount = parseInt(await queries.users.removeHouseholdUser(db, logger, {
      userId: secondaryUser.user_id,
      householdId: defaultUser.primary_household_id,
      userIdToDelete: defaultUser.user_id,
    }));


    tap.strictSame(deletedCount, 0);
    await db.end();
  }));

  tap.end();
});
