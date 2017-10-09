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

tap.test("db/transactions/grocery-lists/update-item", async (tap) => {

  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  await (async () => {
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

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and checked = true`,
    })).rows[0].count);

    tap.assert(count == 1, "clean simple update (only checked)");

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
      categoryId: 2,
      quantityTypeId: null,
      quantity: null,
      checked: null,
      purchased: null,
      unitCost: null,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and category_id = 2`,
    })).rows[0].count);

    tap.assert(count == 1, "update category");

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
      quantityTypeId: 2,
      quantity: null,
      checked: null,
      purchased: null,
      unitCost: null,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items 
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and quantity_type_id = 2`,
    })).rows[0].count);

    tap.assert(count == 1, "update quantity_type_id");

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
      itemName: "Pastry Tart",
      categoryId: null,
      quantityTypeId: null,
      quantity: null,
      checked: null,
      purchased: null,
      unitCost: null,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items gli
              inner join items i
                on gli.item_id = i.item_id
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and i.name = 'Pastry Tart'`,
    })).rows[0].count);

    tap.assert(count == 1, "update item name");

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
      itemName: "Pastry Tart",
      categoryId: 4,
      quantityTypeId: null,
      quantity: null,
      checked: null,
      purchased: null,
      unitCost: null,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items gli
              inner join items i
                on gli.item_id = i.item_id
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and i.name = 'Pastry Tart'
              and category_id = 4`,
    })).rows[0].count);

    tap.assert(count == 1, "update item name and category");

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
      quantity: 1.4,
      checked: null,
      purchased: null,
      unitCost: null,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items gli
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and quantity = 1.4`,
    })).rows[0].count);

    tap.assert(count == 1, "update quantity to decimal");

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
      checked: null,
      purchased: true,
      unitCost: null,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items gli
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and purchased_at is not null
              and purchased_by_id = ${ defaultTestUser.user_id }`,
    })).rows[0].count);

    tap.assert(count == 1, "set purchased sets purchased at and purchased by id");

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
      checked: null,
      purchased: null,
      unitCost: 4.40,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items gli
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and unit_cost = '$4.40'`,
    })).rows[0].count);

    tap.assert(count == 1, "update unit cost");

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
      checked: null,
      purchased: null,
      unitCost: 4.40,
    });

    const count = parseInt((await db.query({
      text:` select count(*) as count
             from grocery_list_items gli
             where grocery_list_id = ${ groceryListId }
              and grocery_list_item_id = ${ groceryListItemId }
              and unit_cost = '$4.40'`,
    })).rows[0].count);

    tap.assert(count == 1, "update unit cost");

    await db.end();
  })();

  tap.end();
});
