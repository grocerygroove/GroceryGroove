require('dotenv').load();
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const tap = require("tap");
const transactions = require("../../transactions");

tap.test("db/transactions/items/add-and-categorize-item", tap => {
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

    const itemId = await transactions.items.addAndCategorizeItem(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      name: "Pop Tarts",
      description: "A tasty tart",
      categoryId: 1,
    });

    tap.assert(itemId);

    await db.end();
  });

  tap.end();
});
