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

tap.test("db/queries/grocery-lists/items/get-all", async (tap) => {
  await (async () => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const testGroceryListName = "Awesome List";

    const groceryListItem = {
      "grocery_list_item_id": null,
      "item_id": null,
      "item_name": "Bread",
      "category_id": 2,
      "category_name": "Bread/Bakery",
      "quantity_type_id": 2,
      "singular_name": "piece",
      "plural_name": "pieces",
      "singular_abbreviation": "pc",
      "plural_abbreviation": "pcs",
      "quantity": "1",
      "checked": false,
      "added_by_id": defaultTestUser.user_id,
      "added_by_nickname": defaultTestUser.nickname,
    };

    const groceryListItem2 = {
      "grocery_list_item_id": null,
      "item_id": null,
      "item_name": "Milk",
      "category_id": 4,
      "category_name": "Dairy",
      "quantity_type_id": 4,
      "singular_name": "gallon",
      "plural_name": "gallons",
      "singular_abbreviation": "gal",
      "plural_abbreviation": null,
      "quantity": "2",
      "checked": false,
      "added_by_id": defaultTestUser.user_id,
      "added_by_nickname": defaultTestUser.nickname,
    };


    //Create a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
    });

    const itemId1 = await queries.items.createItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: groceryListItem.item_name,
    });

    groceryListItem.item_id = itemId1;

    //Add item to grocery list
    const groceryListItemId1 = await transactions.groceryLists.addItem(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      itemName: groceryListItem.item_name,
      categoryId: groceryListItem.category_id,
      quantityTypeId: groceryListItem.quantity_type_id,
      quantity: groceryListItem.quantity,
    });
    groceryListItem.grocery_list_item_id = groceryListItemId1;


    const itemId2 = await queries.items.createItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: groceryListItem2.item_name,
    });

    groceryListItem2.item_id = itemId2;

    //Add item to grocery list
    const groceryListItemId2 = await transactions.groceryLists.addItem(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      itemName: groceryListItem2.item_name,
      categoryId: groceryListItem2.category_id,
      quantityTypeId: groceryListItem2.quantity_type_id,
      quantity: groceryListItem2.quantity,
    });

    groceryListItem2.grocery_list_item_id = groceryListItemId2;

    const actual = await queries.groceryLists.items.getAll(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId: groceryListId,
    });
    const expected = [ groceryListItem, groceryListItem2 ];

    tap.deepEquals(actual, expected, "get items from list you have access to");
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

    const testGroceryListName = "Awesome List";

    const groceryListItem = {
      "grocery_list_item_id": null,
      "item_id": null,
      "item_name": "Bread",
      "category_id": 2,
      "category_name": "Bread/Bakery",
      "quantity_type_id": 2,
      "singular_name": "piece",
      "plural_name": "pieces",
      "singular_abbreviation": "pc",
      "plural_abbreviation": "pcs",
      "quantity": "1",
      "checked": false,
      "added_by_id": defaultTestUser.user_id,
      "added_by_nickname": defaultTestUser.nickname,
    };

    const groceryListItem2 = {
      "grocery_list_item_id": null,
      "item_id": null,
      "item_name": "Milk",
      "category_id": 4,
      "category_name": "Dairy",
      "quantity_type_id": 4,
      "singular_name": "gallon",
      "plural_name": "gallons",
      "singular_abbreviation": "gal",
      "plural_abbreviation": null,
      "quantity": "2",
      "checked": false,
      "added_by_id": defaultTestUser.user_id,
      "added_by_nickname": defaultTestUser.nickname,
    };


    //Create a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
    });

    const itemId1 = await queries.items.createItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: groceryListItem.item_name,
    });

    groceryListItem.item_id = itemId1;

    //Add item to grocery list
    const groceryListItemId1 = await transactions.groceryLists.addItem(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      itemName: groceryListItem.item_name,
      categoryId: groceryListItem.category_id,
      quantityTypeId: groceryListItem.quantity_type_id,
      quantity: groceryListItem.quantity,
    });

    groceryListItem.grocery_list_item_id = groceryListItemId1;

    const itemId2 = await queries.items.createItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: groceryListItem2.item_name,
      categoryId: groceryListItem2.category_id,
    });

    groceryListItem2.item_id = itemId2;

    //Add item to grocery list
    const groceryListItemId2 = await transactions.groceryLists.addItem(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      itemName: groceryListItem2.item_name,
      categoryId: groceryListItem2.category_id,
      quantityTypeId: groceryListItem2.quantity_type_id,
      quantity: groceryListItem2.quantity,
    });

    groceryListItem.grocery_list_item_id = groceryListItemId1;

    const actual = await queries.groceryLists.items.getAll(db, logger, {
      userId: secondaryTestUser.user_id,
      groceryListId: groceryListId,
    });
    const expected = [ ];

    tap.deepEquals(actual, expected, "get items for a list you don't have access to returns 0 rows");
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

    const testGroceryListName = "Awesome List";

    const groceryListItem = {
      "grocery_list_item_id": null,
      "item_id": null,
      "item_name": "Bread",
      "category_id": 2,
      "category_name": "Bread/Bakery",
      "quantity_type_id": 2,
      "singular_name": "piece",
      "plural_name": "pieces",
      "singular_abbreviation": "pc",
      "plural_abbreviation": "pcs",
      "quantity": "1",
      "checked": false,
      "added_by_id": defaultTestUser.user_id,
      "added_by_nickname": defaultTestUser.nickname,
    };

    const groceryListItem2 = {
      "grocery_list_item_id": null,
      "item_id": null,
      "item_name": "Milk",
      "category_id": 4,
      "category_name": "Dairy",
      "quantity_type_id": 4,
      "singular_name": "gallon",
      "plural_name": "gallons",
      "singular_abbreviation": "gal",
      "plural_abbreviation": null,
      "quantity": "2",
      "checked": false,
      "added_by_id": secondaryTestUser.user_id,
      "added_by_nickname": secondaryTestUser.nickname,
    };

    //Add secondary user to default user's household
    await queries.users.createHouseholdUser(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      userId: secondaryTestUser.user_id,
    });


    //Create a grocery list
    const groceryListId = await queries.groceryLists.addOne(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListName: testGroceryListName,
      householdId: defaultTestUser.primary_household_id,
    });

    const itemId1 = await queries.items.createItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: groceryListItem.item_name,
    });

    groceryListItem.item_id = itemId1;

    //Add item to grocery list
    const groceryListItemId1 = await transactions.groceryLists.addItem(db, logger, {
      userId: defaultTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      itemName: groceryListItem.item_name,
      categoryId: groceryListItem.category_id,
      quantityTypeId: groceryListItem.quantity_type_id,
      quantity: groceryListItem.quantity,
    });

    groceryListItem.grocery_list_item_id = groceryListItemId1;

    const itemId2 = await queries.items.createItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: groceryListItem2.item_name,
    });

    groceryListItem2.item_id = itemId2;

    //Add item to grocery list
    const groceryListItemId2 = await transactions.groceryLists.addItem(db, logger, {
      userId: secondaryTestUser.user_id,
      householdId: defaultTestUser.primary_household_id,
      groceryListId,
      itemName: groceryListItem2.item_name,
      categoryId: groceryListItem2.category_id,
      quantityTypeId: groceryListItem2.quantity_type_id,
      quantity: groceryListItem2.quantity,
    });

    groceryListItem2.grocery_list_item_id = groceryListItemId2;

    const actual = await queries.groceryLists.items.getAll(db, logger, {
      userId: defaultTestUser.user_id,
      groceryListId: groceryListId,
    });
    const expected = [ groceryListItem, groceryListItem2 ];

    tap.deepEquals(actual, expected, "grocery lists containing inserts from multiple users returns all rows");
    await db.end();
  })();

  tap.end();
});
