require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("database-connection");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const queries = require("../../queries");

const makeDatabase = makeDatabaseReal.bind(null, {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
});

const tap = require("tap");

tap.test("db/queries/categories/get-all-names", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    const sortByName = (a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }
        return 0;
    };
    const defaultCategories = [
        {
            "name": "Beverages",
        },
        {
            "name": "Bread/Bakery",
        },
        {
            "name": "Canned Goods",
        },
        {
            "name": "Dairy",
        },
        {
            "name": "Baking Goods",
        },
        {
            "name": "Frozen Foods",
        },
        {
            "name": "Meat",
        },
        {
            "name": "Produce",
        },
        {
            "name": "Home Goods",
        },
        {
            "name": "Personal Care",
        },
        {
            "name": "Other",
        },
    ].sort(sortByName);


    tap.test("get-all-names default", a(function* (tap) {
        yield resetTestingDb();

        const db = makeDatabase();

        const queriedRows = (yield queries.categories.getAllNames(db, logger, [
            1,
        ])).asPlainObjects();

        tap.strictSame(queriedRows, defaultCategories);

        yield db.end();
    }));

    tap.test("add one then get-all-names", a(function* (tap) {
        yield resetTestingDb();

        const db = makeDatabase();
        const testCategoryName = "test category";
        yield queries.categories.addOne(db, logger, [
            defaultTestUser.primary_household_id,
            defaultTestUser.user_id,
            testCategoryName,
        ]);

        let expected;
        expected = defaultCategories.slice();
        expected.push({
            "name": testCategoryName,
        });
        expected = expected.sort(sortByName);

        const queriedRows = (yield queries.categories.getAllNames(db, logger, [
            defaultTestUser.user_id,
        ])).asPlainObjects();

        tap.strictSame(queriedRows, expected);

        yield db.end();
    }));


    tap.end();
});
