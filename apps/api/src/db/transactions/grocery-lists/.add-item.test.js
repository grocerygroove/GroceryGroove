require('dotenv').load();
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const InvalidCategoryError = require("../../../errors/invalid-category-error");
const InvalidGroceryListError = require("../../../errors/invalid-grocery-list-error");
const InvalidQuantityTypeError = require("../../../errors/invalid-quantity-type-error");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const tap = require("tap");
const transactions = require("../../transactions");

tap.test("db/transactions/grocery-lists/add-item", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  tap.test("clean insert", async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListName: "Super List",
    });

    const groceryListItemId = await transactions.groceryLists.addItem(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      itemName: "Pop Tarts",
      itemDescription: "A tasty tart.",
      categoryId: 3,
      quantityTypeId: 4,
      quantity: 2,
    });


    tap.assert(groceryListItemId);

    await db.end();
  });

  tap.test("invalid grocery list", async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    try {
      const groceryListItemId = await transactions.groceryLists.addItem(db, logger, {
        userId: defaultTestUser.user_id,
        householdId: defaultTestUser.primary_household_id,
        groceryListId: 24,
        itemName: "Pop Tarts",
        itemDescription: "A tasty tart.",
        categoryId: 3,
        quantityTypeId: 4,
        quantity: 2,
      });
    } catch (e) {
      tap.type(e, 'InvalidGroceryListError', 'Invalid grocery list id throws InvalidGroceryListError');
    } finally {
      await db.end();
    }
  });

  tap.test("invalid category", async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListName: "Super List",
    });

    try {
      const groceryListItemId = await transactions.groceryLists.addItem(db, logger, {
        userId: defaultTestUser.user_id,
        householdId: defaultTestUser.primary_household_id,
        groceryListId: groceryListId,
        itemName: "Pop Tarts",
        itemDescription: "A tasty tart.",
        categoryId: 25,
        quantityTypeId: 4,
        quantity: 2,
      });
    } catch (e) {
      tap.type(e, 'InvalidCategoryError', 'Invalid category id throws InvalidCategoryError');
    } finally {
      await db.end();
    }
  });

  tap.test("invalid quantity type", async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListName: "Super List",
    });

    try {
      const groceryListItemId = await transactions.groceryLists.addItem(db, logger, {
        userId: defaultTestUser.user_id,
        householdId: defaultTestUser.primary_household_id,
        groceryListId: groceryListId,
        itemName: "Pop Tarts",
        itemDescription: "A tasty tart.",
        categoryId: 4,
        quantityTypeId: 400,
        quantity: 2,
      });
    } catch (e) {
      tap.type(e, 'InvalidQuantityTypeError', 'Invalid quantity type id throws InvalidQuantityTypeError');
    } finally {
      await db.end();
    }
  });

  tap.end();
});
