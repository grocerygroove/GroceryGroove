require('dotenv').load();
global.Promise = require("bluebird");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

tap.test("db/queries/households/create", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  tap.test("create-a-household", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const testHouseholdName = "Super Test Household";

    const startCount = parseInt((await db.query({
      text:` select count(*) as count
             from households
             where name = '${ testHouseholdName }'`,
    })).rows[0].count);

    const householdId = await queries.households.create(db, logger, {
      name: testHouseholdName,
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from households
             where name = '${ testHouseholdName }'`,
    })).rows[0].count);

    tap.assert(householdId);
    tap.assert(endCount > startCount);

    await db.end();
  }));

  tap.end();
});
