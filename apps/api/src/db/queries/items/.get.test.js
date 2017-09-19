require('dotenv').load();
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/items/get-item-by-name", tap => {

  tap.test("valid request returns item id", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });
    const params = {
      householdId: 1,
      name: "Pop Tarts",
      description: "A tasty tart",
    };

    const itemId = await queries.items.createItem(db, logger, {
      householdId: params.householdId,
      name: params.name,
      description: params.description,
    });

    //Insert an item
    const selectedItemId = await queries.items.getItemByName(db, logger, {
      householdId: params.householdId,
      name: params.name,
    });

    tap.same(itemId, selectedItemId);

    await db.end();
  })); 

  tap.test("request non-existant item", (async (tap) => {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const selectedItemId = await queries.items.getItemByName(db, logger, {
      householdId: 20,
      name: "Cat Food",
    });

    tap.assert(typeof(selectedItemId) == "undefined");

    await db.end();
  }));

  tap.end();
});
