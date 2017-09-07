require('dotenv').load();
global.Promise = require("bluebird");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const queries = require("../../queries");
const DuplicateNameError = require("../../../errors/duplicate-name-error");
const Pool = require('pg').Pool;
const tap = require("tap");

tap.test("db/queries/categories/add-one", tap => {
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

    const testCategory = {
      "category_id": 12,
      "household_id": defaultTestUser.primary_household_id,
      "name": "testcategory",
      "created_by_id": defaultTestUser.user_id,
    };

    //Add a category
    await queries.categories.addOne(db, logger, {
      householdId: testCategory.household_id,
      createdById: testCategory.created_by_id,
      name: testCategory.name,
    });

    const rows = await db.query(logger, `
            SELECT *
            FROM categories
            WHERE name = '${testCategory.name}'`);

    const actual = rows[0];
    const expected = testCategory;
    tap.strictSame(actual, expected, "Add a category");

    await db.end();

  }));

  tap.test("duplicate insert", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const testCategory = {
      "category_id": 12,
      "household_id": null,
      "name": "testcategory",
      "created_by_id": null,
    };

    //Add a category, first insert should be good
    await queries.categories.addOne(db, logger, {
      householdId: testCategory.household_id,
      createdById: testCategory.created_by_id,
      name: testCategory.name,
    });

    //Second should throw a DuplicateNameError
    try {
      await queries.categories.addOne(db, logger, {
        householdId: testCategory.household_id,
        createdById: testCategory.created_by_id,
        name: testCategory.name,
      });
    } catch (e) {
      console.log(JSON.stringify(e,null,2))
      tap.type(e, 'DuplicateNameError', "Duplicate category insert throws DuplicateNameError");
    }

    await db.end();
  }));

  tap.end();
});
