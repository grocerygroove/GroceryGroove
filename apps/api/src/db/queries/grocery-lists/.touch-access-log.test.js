require('dotenv').load();
global.Promise = require("bluebird");
const defaultTestUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/grocery-lists/touch-access-log", tap => {
  tap.test("touch-access-log", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const glName = "Test 1 List";
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: glName,
      householdId: defaultTestUser.primary_household_id,
    });

    const initialCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_access_logs 
             where grocery_list_id = '${groceryListId}'`,
    })).rows[0].count);


    await queries.groceryLists.touchAccessLog(db, logger, {
      groceryListId,
    });

    const secondaryCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_access_logs 
             where grocery_list_id = '${groceryListId}'`,
    })).rows[0].count);

    tap.assert(secondaryCount > initialCount);

    await db.end();
  }));

  tap.end();
});
