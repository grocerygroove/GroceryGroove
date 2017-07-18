require('dotenv').load();
global.Promise = require("bluebird");
const makeDatabaseReal = require("database-connection");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const transactions = require("../../transactions");

const makeDatabase = makeDatabaseReal.bind(null, {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
});

const tap = require("tap");

tap.test("db/transactions/households/create-for-user", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    tap.test("clean insert", async (tap) => {
        await resetTestingDb();

        const db = makeDatabase();
        const args = {
            userId: defaultTestUser.user_id,
            householdName: "Jared's House of Fun",
        };

        const householdId = await transactions.households.createForUser(
            db,
            logger,
            args
        );

        const rows = (await db.query(logger, `
            SELECT *
            FROM households
            WHERE household_id = ${householdId}
        `)).asPlainObjects();

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
        tap.strictSame(actual, expected, "Create Househould for User");

        await db.end();
    });

    tap.end();
});