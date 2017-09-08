require('dotenv').load();
global.Promise = require("bluebird");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const DuplicateNameError = require("../../../errors/duplicate-name-error");
const objectLike = require("../../../utils/object-like");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const tap = require("tap");

tap.test("db/queries/grocery-lists/get-one", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  tap.test("add, then get list", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });
    const testGroceryListName = "Test List";

    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
    });
    //Gotta touch the access log after creation or other queries won't work.
    await queries.groceryLists.touchAccessLog(db, logger, {
      groceryListId,
    });

    const actual = await queries.groceryLists.getOne(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      userId: defaultTestUser.user_id,
      groceryListId,
    });

    tap.ok(objectLike(actual, [
      {
        propertyName: "grocery_list_id",
        comparisonValue: groceryListId,
      },
      {
        propertyName: "created_by_id",
        comparisonValue: defaultTestUser.user_id,
      },
      {
        propertyName: "name",
        comparisonValue: testGroceryListName,
      },
      {
        propertyName: "created_at",
        nonNull: true,
      },
      {
        propertyName: "last_touched",
        nonNull: true,
      },
    ]));

    await db.end();
  }));

  tap.end();
});
