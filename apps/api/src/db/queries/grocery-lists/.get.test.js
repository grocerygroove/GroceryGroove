require('dotenv').load();
global.Promise = require("bluebird");
const defaultTestUser = require("../../../utils/default-test-user");
const DuplicateNameError = require("../../../errors/duplicate-name-error");
const objectLike = require("../../../utils/object-like");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/grocery-lists/get-all", tap => {
  tap.test("add two, then get lists", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const glName1 = "Test 1 List";
    const glName2 = "Test 2 List";

    const addGroceryList = (async function (name) {
      const groceryListId = await queries.groceryLists.addOne(db, logger, {
        userId: defaultTestUser.user_id,
        groceryListName: name,
        householdId: defaultTestUser.primary_household_id,
      });
      //Gotta touch the access log after creation or other queries won't work.
      await queries.groceryLists.touchAccessLog(db, logger, {
        groceryListId,
      });
    });

    await addGroceryList(glName1);
    await addGroceryList(glName2);

    const rows = await queries.groceryLists.getAll(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      userId: defaultTestUser.user_id,
    });

    tap.ok(
      objectLike(rows[0], [
        {
          propertyName: "grocery_list_id",
          comparisonValue: 2,
        },
        {
          propertyName: "created_by_id",
          comparisonValue: defaultTestUser.user_id,
        },
        {
          propertyName: "name",
          comparisonValue: glName2,
        },
        {
          propertyName: "created_at",
          nonNull: true,
        },
        {
          propertyName: "last_touched",
          nonNull: true,
        },
      ]) &&
      objectLike(rows[1], [
        {
          propertyName: "grocery_list_id",
          comparisonValue: 1,
        },
        {
          propertyName: "created_by_id",
          comparisonValue: defaultTestUser.user_id,
        },
        {
          propertyName: "name",
          comparisonValue: glName1,
        },
        {
          propertyName: "created_at",
          nonNull: true,
        },
        {
          propertyName: "last_touched",
          nonNull: true,
        },
      ])
    );

    await db.end();
  }));

  tap.end();
});

tap.test("db/queries/grocery-lists/get-one", tap => {
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
