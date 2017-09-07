require('dotenv').load();
global.Promise = require("bluebird");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const secondaryTestUser = require("../../../utils/secondary-test-user");
const queries = require("../../queries");

const tap = require("tap");

tap.test("db/queries/categories/get-all", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  const defaultCategories = [
    {
      "category_id": 1,
      "name": "Beverages",
    },
    {
      "category_id": 2,
      "name": "Bread/Bakery",
    },
    {
      "category_id": 3,
      "name": "Canned Goods",
    },
    {
      "category_id": 4,
      "name": "Dairy",
    },
    {
      "category_id": 5,
      "name": "Baking Goods",
    },
    {
      "category_id": 6,
      "name": "Frozen Foods",
    },
    {
      "category_id": 7,
      "name": "Meat",
    },
    {
      "category_id": 8,
      "name": "Produce",
    },
    {
      "category_id": 9,
      "name": "Home Goods",
    },
    {
      "category_id": 10,
      "name": "Personal Care",
    },
    {
      "category_id": 11,
      "name": "Other",
    },
  ].sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    }
    return 0;
  });


  tap.test("get-all default", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const actual = await queries.categories.getAll(db, logger, {
      householdId: 1,
    });

    const expected = defaultCategories;
    tap.same(actual, expected);

    await db.end();
  }));

  tap.test("add one then get-all", (async function (tap) {
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

    //Add a category from a different household
    await queries.categories.addOne(db, logger, {
      householdId: secondaryTestUser.primary_household_id,
      createdById: secondaryTestUser.user_id,
      name: "Test Category 2",
    });

    //Shouldn't include secondary user's category
    const expected = defaultCategories.slice();
    expected.push({
      "category_id": 12,
      "name": testCategoryName,
    });

    const actual = await queries.categories.getAll(db, logger, {
      householdId: defaultTestUser.primary_household_id,
    });


    tap.same(actual, expected);

    await db.end();
  }));


  tap.end();
});
