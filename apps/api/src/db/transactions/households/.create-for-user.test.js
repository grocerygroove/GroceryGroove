require('dotenv').load();
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const tap = require("tap");
const transactions = require("../../transactions");

tap.test("db/transactions/households/create-for-user", tap => {
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
    const args = {
      userId: defaultTestUser.user_id,
      householdName: "Jared's House of Fun",
    };

    const householdId = await transactions.households.createForUser(
      db,
      logger,
      args
    );

    const rows = (await db.query({
      text: `SELECT *
             FROM households
             WHERE household_id = ${householdId}`,
    })).rows;

    const actual = {
      "household_id": rows[0]["household_id"],
      "name": rows[0]["name"],
      "created_by_id": rows[0]["created_by_id"]
    };
    const expected = {
      "household_id": householdId,
      "name": args.householdName,
      "created_by_id": args.userId
    };
    tap.same(actual, expected, "Create Househould for User");

    await db.end();
  });

  tap.end();
});
