require('dotenv').load();
global.Promise = require("bluebird");
const defaultTestUser = require("../../../utils/default-test-user");
const DuplicateNameError = require("../../../errors/duplicate-name-error");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

tap.test("db/queries/grocery-lists/add-one", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  tap.test("clean insert", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const testGroceryListName = "Test List";

    await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
    });

    const rows = (await db.query({
      text:` select count(*) as count
             from grocery_lists
             where name = '${testGroceryListName}'
              and household_id = '${defaultTestUser.primary_household_id}'
              and created_by_id = '${defaultTestUser.user_id}'`,
    })).rows;

    const actual = parseInt(rows[0].count, 10);
    const expected = 1;

    tap.strictEquals(actual, expected);

    await db.end();
  }));

  tap.test("duplicate insert throws DuplicateNameError", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const testGroceryListName = "Test List";

    //Add grocery list, first insert should be good
    await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
    });

    //Second should throw a DuplicateNameError
    try {
      await queries.groceryLists.addOne(db, logger, {
        userId: defaultTestUser.user_id,
        groceryListName: testGroceryListName,
        householdId: defaultTestUser.primary_household_id,
      });
    } catch (e) {
      tap.type(e, 'DuplicateNameError', "Duplicate category insert throws DuplicateNameError");
    }

    await db.end();
  }));

  tap.end();
});
