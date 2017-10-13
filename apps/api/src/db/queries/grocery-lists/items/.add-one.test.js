require('dotenv').load();
const defaultTestUser = require("../../../../utils/default-test-user");
const InvalidQuantityTypeError = require('../../../../errors/invalid-quantity-type-error');
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

tap.test("db/queries/grocery-lists/items/add-one", async (tap) => {
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

    await queries.groceryLists.items.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId,
      itemId,
      categoryId,
      quantityTypeId,
      quantity,
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and item_id = ${ itemId }
              and category_id = ${ categoryId }
              and quantity_type_id = ${ quantityTypeId }
              and quantity = ${ quantity }
              and added_by_id = ${ defaultTestUser.user_id }`,
    })).rows[0].count);

    tap.assert(endCount > startCount, "clean insert");
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
      userId: secondaryTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: secondaryTestUser.primary_household_id,
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

    await queries.groceryLists.items.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId,
      itemId,
      categoryId,
      quantityTypeId,
      quantity,
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and item_id = ${ itemId }
              and category_id = ${ categoryId }
              and quantity_type_id = ${ quantityTypeId }
              and quantity = ${ quantity }
              and added_by_id = ${ defaultTestUser.user_id }`,
    })).rows[0].count);

    tap.assert(endCount == startCount, "user cannot insert into grocery list they aren't a part of");
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
    const itemId = await queries.items.createItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: itemName,
      description: itemDescription,
    });


    //Create a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
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

    await queries.groceryLists.items.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId,
      itemId,
      categoryId,
      quantityTypeId,
      quantity,
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and item_id = ${ itemId }
              and category_id = ${ categoryId }
              and quantity_type_id = ${ quantityTypeId }
              and quantity = ${ quantity }
              and added_by_id = ${ defaultTestUser.user_id }`,
    })).rows[0].count);

    tap.assert(endCount == startCount,"user cannot insert a non-categorized item into grocery list");
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

    const quantityTypeId = 91;
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

    try {
      await queries.groceryLists.items.addOne(db, logger, {
        userId: defaultTestUser.user_id,
        groceryListId,
        itemId,
        categoryId,
        quantityTypeId,
        quantity,
      });
    } catch (e) {
      tap.type(e, 'InvalidQuantityTypeError', 'Invalid quantity type throws and InvalidQuantityTypeError');
    } finally {
      await db.end();
    }

  })();

  tap.end();
});
