require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("../../make-database");
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

tap.test("db/queries/grocery-lists/get-one", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    tap.test("add, then get list", a(function* (tap) {
        yield a(function* () {
            yield resetTestingDb();

            const db = makeDatabase();
            const testGroceryListName = "Test List";

            const groceryListId = yield queries.groceryLists.addOne(db, logger, [
                defaultTestUser.user_id,
                testGroceryListName,
                defaultTestUser.primary_household_id,
            ]);
            //Gotta touch the access log after creation or other queries won't work.
            yield queries.groceryLists.touchAccessLog(db, logger, [
                groceryListId,
            ]);

            const actual = yield queries.groceryLists.getOne(db, logger, [
                defaultTestUser.primary_household_id,
                defaultTestUser.user_id,
                groceryListId,
            ]);

            const valuesWeAreConcernedAbout = ((actual.grocery_list_id === groceryListId) &&
                (actual.created_by_id === defaultTestUser.user_id) &&
                (actual.name === testGroceryListName) &&
                (actual.created_at ? true : false) &&
                (actual.last_touched ? true : false)) === true;


            tap.ok(valuesWeAreConcernedAbout);

            yield db.end();
        })();
    }));

    tap.end();
});
