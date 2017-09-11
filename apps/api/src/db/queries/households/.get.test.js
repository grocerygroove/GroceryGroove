require('dotenv').load();
global.Promise = require("bluebird");
const defaultTestUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

tap.test("db/queries/households/get-household-info", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

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
