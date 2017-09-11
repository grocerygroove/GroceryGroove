require('dotenv').load();
global.Promise = require("bluebird");
const defaultUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const secondaryUser = require("../../../utils/secondary-test-user");
const tap = require("tap");


const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/households/set-administrator", tap => {
  tap.test("administrator can promote another user", (async (tap) => {
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

    const updatedCount = parseInt(await queries.households.setAdministrator(db, logger, {
      userId: defaultUser.user_id,
      householdId: defaultUser.primary_household_id,
      userToPromote: secondaryUser.user_id,
    }));

    tap.strictSame(updatedCount, 1);

    await db.end();
  }));

  tap.test("non-administrator cannot promote another user", (async (tap) => {
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

    const updatedCount = parseInt(await queries.households.setAdministrator(db, logger, {
      userId: secondaryUser.user_id,
      householdId: defaultUser.primary_household_id,
      userToPromote: secondaryUser.user_id,
    }));

    tap.strictSame(updatedCount, 0);

    await db.end();
  }));

  tap.end();
});

tap.test("db/queries/households/set-initial-user", tap => { 
  tap.test("set-initial-user", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const testHouseholdName = "Funky Test Household";
    //Create a household
    const newHousehold = await queries.households.create(db, logger, {
      name: testHouseholdName,
    });

    const initialCount = parseInt((await db.query({
      text: `
        SELECT COUNT(*) as count    
        FROM households
        WHERE name = '${testHouseholdName}' 
          AND created_by_id = '${defaultUser.user_id}'
          AND household_admin = '${defaultUser.user_id}'`,
    })).rows[0].count);

    await queries.households.setInitialUser(db, logger, {
      householdId: newHousehold,
      userId: defaultUser.user_id,
    });

    const secondaryCount = parseInt((await db.query({
      text: `
        SELECT COUNT(*) as count  
        FROM households
        WHERE name = '${testHouseholdName}' 
          AND created_by_id = '${defaultUser.user_id}'
          AND household_admin = '${defaultUser.user_id}'`,
    })).rows[0].count);

    tap.assert(secondaryCount > initialCount);
    await db.end();
  }));

  tap.end();
});
