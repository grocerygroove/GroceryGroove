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

tap.test("db/queries/grocery-lists/items/update-one", async (tap) => {
  await (async () => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

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

    const startCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and item_id = ${ itemId }
              and category_id = ${ categoryId }
              and quantity_type_id = ${ quantityTypeId }
              and quantity = ${ quantity }
              and added_by_id = ${ defaultTestUser.user_id }
              and checked = true`,
    })).rows[0].count);


    const updateParams = {
      householdId: defaultTestUser.primary_household_id,
      userId: defaultTestUser.user_id,
      groceryListId,
      groceryListItemId,
      itemId,
      categoryId,
      quantityTypeId,
      quantity,
      checked: true,
      purchasedAt: null,
      purchasedById: null,
      unitCost: null,
    };
    await queries.groceryLists.items.updateOne(db, logger, updateParams);

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and item_id = ${ itemId }
              and category_id = ${ categoryId }
              and quantity_type_id = ${ quantityTypeId }
              and quantity = ${ quantity }
              and added_by_id = ${ defaultTestUser.user_id }
              and checked = true`,
    })).rows[0].count);

    tap.assert(endCount > startCount, "clean update");

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

    const startCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and item_id = ${ itemId }
              and category_id = ${ categoryId }
              and quantity_type_id = ${ quantityTypeId }
              and quantity = ${ quantity }
              and added_by_id = ${ defaultTestUser.user_id }`,
    })).rows[0].count);


    const updateParams = {
      householdId: defaultTestUser.primary_household_id,
      userId: defaultTestUser.user_id,
      groceryListId,
      groceryListItemId,
      itemId: 200,
      categoryId,
      quantityTypeId,
      quantity,
      checked: true,
      purchasedAt: null,
      purchasedById: null,
      unitCost: null,
    };
    await queries.groceryLists.items.updateOne(db, logger, updateParams);

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and item_id = ${ updateParams.itemId }
              and category_id = ${ categoryId }
              and quantity_type_id = ${ quantityTypeId }
              and quantity = ${ quantity }
              and added_by_id = ${ defaultTestUser.user_id }`,
    })).rows[0].count);

    tap.assert(endCount < startCount, "update to nonexistant itemId doesn't update");

    await db.end();
  })();

  tap.end();
});
