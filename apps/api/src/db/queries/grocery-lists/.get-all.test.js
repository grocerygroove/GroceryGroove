require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("../../make-database");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const objectLike = require("../../../utils/object-like");
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

tap.test("db/queries/grocery-lists/get-all", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    tap.test("add two, then get lists", a(function* (tap) {
        yield a(function* () {
            yield resetTestingDb();

            const db = makeDatabase();
            const glName1 = "Test 1 List";
            const glName2 = "Test 2 List";

            const addGroceryList = a(function* (name) {
                const groceryListId = yield queries.groceryLists.addOne(db, logger, [
                    defaultTestUser.user_id,
                    name,
                    defaultTestUser.primary_household_id,
                ]);
                //Gotta touch the access log after creation or other queries won't work.
                yield queries.groceryLists.touchAccessLog(db, logger, [
                    groceryListId,
                ]);
            });

            yield addGroceryList(glName1);
            yield addGroceryList(glName2);

            const rows = yield queries.groceryLists.getAll(db, logger, [
                defaultTestUser.primary_household_id,
                defaultTestUser.user_id,
            ]);

            tap.ok(
                objectLike(rows[0], [
                    {
                        propertyName: "grocery_list_id",
                        comparisonValue: 2,
                    },
                    {
                        propertyName: "created_by_id",
                        comparisonValue: defaultTestUser.user_id,
                    },
                    {
                        propertyName: "name",
                        comparisonValue: glName2,
                    },
                    {
                        propertyName: "created_at",
                        nonNull: true,
                    },
                    {
                        propertyName: "last_touched",
                        nonNull: true,
                    },
                ]) &&
                objectLike(rows[1], [
                    {
                        propertyName: "grocery_list_id",
                        comparisonValue: 1,
                    },
                    {
                        propertyName: "created_by_id",
                        comparisonValue: defaultTestUser.user_id,
                    },
                    {
                        propertyName: "name",
                        comparisonValue: glName1,
                    },
                    {
                        propertyName: "created_at",
                        nonNull: true,
                    },
                    {
                        propertyName: "last_touched",
                        nonNull: true,
                    },
                ])
            );


            yield db.end();
        })();
    }));


    tap.end();
});
