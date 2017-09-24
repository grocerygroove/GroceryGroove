require('dotenv').load();
const defaultTestUser = require("../../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../../queries");
const secondaryTestUser = require("../../../../utils/secondary-test-user");
const resetTestingDb = require("../../../../utils/reset-testing-database");
const tap = require("tap");
const transactions = require("../../../transactions");

const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/grocery-lists/items/remove-one", async (tap) => {
  await (async () => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    //Add an item
    const quantityTypeId = 1;
    const quantity = 2;
    const categoryId = 1;
    const itemName = "Pop Tarts";
    const itemDescription = "A tasty tart treat.";
    const testGroceryListName = "Awesome List";

    //Add and categorize an item
    const itemId = await transactions.items.addAndCategorizeItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: itemName,
      description: itemDescription,
      categoryId,
    });

    //Create a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
    });
    const groceryListItemId = await queries.groceryLists.items.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId,
      itemId,
      categoryId,
      quantityTypeId,
      quantity,
    });

    const deletedCount = await queries.groceryLists.items.removeOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId,
      groceryListItemId,
    });

    tap.assert(deletedCount == 1, "Valid deletion of item returns 1");

    await db.end();
  })();

  await (async () => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const groceryListId = 20;
    const groceryListItemId = 35;

    const deletedCount = await queries.groceryLists.items.removeOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId,
      groceryListItemId,
    });

    tap.assert(deletedCount == 0, "Invalid deletion of item returns 0");

    await db.end();
  })();


  tap.end();
});
