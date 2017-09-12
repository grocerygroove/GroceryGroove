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

tap.test("db/queries/user/get-one", tap => {
  tap.test("get one", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const user = await queries.users.getOne(db, logger, {
      userId: defaultUser.user_id,
    });

    const expected = {
      "user_id": defaultUser.user_id,
      "email": defaultUser.email,
      "device_identifier": null,
      "phone_number": null,
      "primary_household_id": defaultUser.primary_household_id,
      "invited_by_id": null,
    };

    tap.same(user, expected);

    await db.end();
  }));

  tap.end();
});

tap.test("db/queries/user/getUserHouseholds", tap => {
  tap.test("get households: scenario: 1", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const households = await queries.users.getUserHouseholds(db, logger, {
      userId: defaultUser.user_id,
    });

    const expected = [ 1 ];

    tap.same(households, expected);

    await db.end();
  }));

  tap.test("get households: scenario: 2", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    await queries.users.createHouseholdUser(db, logger, {
      userId: defaultUser.user_id,
      householdId: secondaryUser.primary_household_id,
    });

    const households = await queries.users.getUserHouseholds(db, logger, {
      userId: defaultUser.user_id,
    });

    const expected = [ 1, 2 ];

    tap.same(households, expected);

    await db.end();
  }));

  tap.end();
});
