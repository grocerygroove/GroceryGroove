require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("database-connection");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const queries = require("../../queries");
const DuplicateNameError = require("../../../errors/duplicate-name-error");

const makeDatabase = makeDatabaseReal.bind(null, {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
});

const tap = require("tap");

tap.test("db/queries/grocery-lists/add-one", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    tap.test("clean insert", a(function* (tap) {
        yield a(function* () {
            yield resetTestingDb();

            const db = makeDatabase();

            const testGroceryListName = "Test List";

            yield queries.groceryLists.addOne(db, logger, [
                defaultTestUser.user_id,
                testGroceryListName,
                defaultTestUser.primary_household_id,
            ]);

            const rows = (yield db.query(logger, `
                SELECT COUNT(*) AS count
                FROM grocery_lists
                WHERE name = '${testGroceryListName}'
                    AND household_id = '${defaultTestUser.primary_household_id}'
                    AND created_by_id = '${defaultTestUser.user_id}'
            `)).asPlainObjects();

            const actual = parseInt(rows[0].count, 10);
            const expected = 1;

            tap.strictEquals(actual, expected);

            yield db.end();
        })();

    }));

    tap.test("duplicate insert throws DuplicateNameError", a(function* (tap) {
        yield a(function* () {
            yield resetTestingDb();

            const db = makeDatabase();

            const testGroceryListName = "Test List";

            //Add grocery list, first insert should be good
            yield queries.groceryLists.addOne(db, logger, [
                defaultTestUser.user_id,
                testGroceryListName,
                defaultTestUser.primary_household_id,
            ]);

            //Second should throw a DuplicateNameError
            try {
                yield queries.groceryLists.addOne(db, logger, [
                    defaultTestUser.user_id,
                    testGroceryListName,
                    defaultTestUser.primary_household_id,
                ]);
            } catch (e) {
                tap.type(e, 'DuplicateNameError', "Duplicate category insert throws DuplicateNameError");
            }

            yield db.end();
        })();

    }));



    tap.end();
});
