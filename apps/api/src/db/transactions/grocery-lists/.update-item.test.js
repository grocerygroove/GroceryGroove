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

tap.test("db/transactions/grocery-lists/update-item", tap => {

  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  tap.test("clean update", async (tap) => {
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
      categoryId: 3,
      quantityTypeId: 4,
      quantity: 2,
    });

    const updatedGroceryListItemId = await transactions.groceryLists.updateItem(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      groceryListItemId,
      itemName: null,
      categoryId: null,
      quantityTypeId: null,
      quantity: null,
      checked: true,
      purchased: null,
      unitCost: null,
    });

    tap.assert(updatedGroceryListItemId);

    await db.end();
  });

  tap.end();
});
