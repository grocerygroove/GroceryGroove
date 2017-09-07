require('dotenv').load();
global.Promise = require("bluebird");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const secondaryTestUser = require("../../../utils/secondary-test-user");
const queries = require("../../queries");

const tap = require("tap");

tap.test("db/queries/categories/get-all-names", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  const sortByName = (a, b) => {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    }
    return 0;
  };
  const defaultCategories = [
    {
      "name": "Beverages",
    },
    {
      "name": "Bread/Bakery",
    },
    {
      "name": "Canned Goods",
    },
    {
      "name": "Dairy",
    },
    {
      "name": "Baking Goods",
    },
    {
      "name": "Frozen Foods",
    },
    {
      "name": "Meat",
    },
    {
      "name": "Produce",
    },
    {
      "name": "Home Goods",
    },
    {
      "name": "Personal Care",
    },
    {
      "name": "Other",
    },
  ].sort(sortByName);


  tap.test("get-all-names default", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const actual = (await queries.categories.getAllNames(db, logger, {
      householdId: 1,
    }));

    const expected = defaultCategories;
    tap.same(actual, expected);

    await db.end();
  }));

  tap.test("add one then get-all-names", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });
    const testCategoryName = "test category";
    await queries.categories.addOne(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      createdById: defaultTestUser.user_id,
      name: testCategoryName,
    });

    //Add a second category from a different householdId
    await queries.categories.addOne(db, logger, {
      householdId: secondaryTestUser.primary_household_id,
      createdById: secondaryTestUser.user_id,
      name: "Test Category #2",
    });

    //Second added category shouldn't be in here
    let expected;
    expected = defaultCategories.slice();
    expected.push({
      "name": testCategoryName,
    });
    expected = expected.sort(sortByName);

    const actual = (await queries.categories.getAllNames(db, logger, {
      householdId: defaultTestUser.primary_household_id,
    }));

    tap.same(actual, expected);

    await db.end();
  }));


  tap.end();
});
