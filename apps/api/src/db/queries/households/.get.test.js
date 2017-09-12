require('dotenv').load();
global.Promise = require("bluebird");
const defaultTestUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");
const secondaryTestUser = require("../../../utils/secondary-test-user");

const logger = {
  info: () => {},
  child: () => { return logger; },
};


tap.test("db/queries/households/get-household-info", tap => {
  tap.test("get-info", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const actual = await queries.households.getHouseholdInfo(db, logger, {
      householdId: defaultTestUser.primary_household_id,
    });

    const expected = {
      name: defaultTestUser.household_name,
      admin: defaultTestUser.email,
    };
    tap.same(actual, expected);

    await db.end();
  }));

  tap.end();
});

tap.test("db/queries/households/get-users-in-household", tap => {
  tap.test("user can view users in their household", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add another user to household
    await queries.users.createHouseholdUser(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      userId: secondaryTestUser.user_id,
    });

    const usersInHousehold = await queries.households.getUsersInHousehold(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
    });

    const expected = [
      {
        "user_id": defaultTestUser.user_id,
        "identifier": defaultTestUser.email,
      },
      {
        "user_id": secondaryTestUser.user_id,
        "identifier": secondaryTestUser.email,
      },
    ];

    tap.same(usersInHousehold, expected);

    await db.end();
  }));

  tap.test("user cannot view users in another household", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const usersInHousehold = await queries.households.getUsersInHousehold(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: secondaryTestUser.primary_household_id,
    });

    const expected = [];

    tap.same(usersInHousehold, expected);

    await db.end();
  }));

  tap.end();
});
