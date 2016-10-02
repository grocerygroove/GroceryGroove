require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("../../make-database");
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

tap.test("db/queries/categories/get-all", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    const defaultCategories = [
        {
            "category_id": 1,
            "name": "Beverages",
        },
        {
            "category_id": 2,
            "name": "Bread/Bakery",
        },
        {
            "category_id": 3,
            "name": "Canned Goods",
        },
        {
            "category_id": 4,
            "name": "Dairy",
        },
        {
            "category_id": 5,
            "name": "Baking Goods",
        },
        {
            "category_id": 6,
            "name": "Frozen Foods",
        },
        {
            "category_id": 7,
            "name": "Meat",
        },
        {
            "category_id": 8,
            "name": "Produce",
        },
        {
            "category_id": 9,
            "name": "Home Goods",
        },
        {
            "category_id": 10,
            "name": "Personal Care",
        },
        {
            "category_id": 11,
            "name": "Other",
        },
    ].sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }
        return 0;
    });


    tap.test("get-all default", a(function* (tap) {
        yield resetTestingDb();

        const db = makeDatabase();

        const queriedRows = (yield queries.categories.getAll(db, logger, [
            1,
        ])).asPlainObjects();

        tap.strictSame(queriedRows, defaultCategories);

        yield db.end();
    }));

    tap.test("add one then get-all", a(function* (tap) {
        yield resetTestingDb();

        const db = makeDatabase();
        const testCategoryName = "test category";
        yield queries.categories.addOne(db, logger, [
            defaultTestUser.primary_household_id,
            defaultTestUser.user_id,
            testCategoryName,
        ]);

        const expected = defaultCategories.slice();
        expected.push({
            "category_id": 12,
            "name": testCategoryName,
        });

        const queriedRows = (yield queries.categories.getAll(db, logger, [
            defaultTestUser.user_id,
        ])).asPlainObjects();

        tap.strictSame(queriedRows, expected);

        yield db.end();
    }));


    tap.end();
});
