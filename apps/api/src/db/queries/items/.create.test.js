require('dotenv').load();
const DuplicateNameError = require("../../../errors/duplicate-name-error");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const tap = require("tap");

const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/items/create-item", tap => {

  tap.test("create an item", (async (tap) => {
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
    };

    const startCount = parseInt((await db.query({
      text:` select count(*) as count
             from items
             where household_id = '${ params.householdId }'
              and name = '${ params.name }'`,
    })).rows[0].count);

    const itemId = await queries.items.createItem(db, logger, {
      householdId: params.householdId,
      name: params.name,
    });

    const endCount = parseInt((await db.query({
      text:` select count(*) as count
             from items
             where household_id = '${ params.householdId }'
              and name = '${ params.name }'`,
    })).rows[0].count);

    tap.assert(itemId);
    tap.assert(endCount > startCount);

    await db.end();
  }));

  tap.test("duplicate insert", (async (tap) => {
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
    };

    await queries.items.createItem(db, logger, {
      householdId: params.householdId,
      name: params.name,
    });

    try {
      await queries.items.createItem(db, logger, {
        householdId: params.householdId,
        name: params.name,
      });
    } catch (e) {
      tap.type(e, 'DuplicateNameError', "Duplicate item insert throws DuplicateNameError");
    }

    await db.end();
  }));

  tap.end();
});
