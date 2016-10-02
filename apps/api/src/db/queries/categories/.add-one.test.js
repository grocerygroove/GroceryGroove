require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("../../make-database");
const resetTestingDb = require("../../../utils/reset-testing-database");
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

tap.test("db/queries/categories/add-one", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    tap.test("clean insert", a(function* (tap) {

        yield a(function* () {
            yield resetTestingDb();

            const db = makeDatabase();

            const testCategory = {
                "category_id": 12,
                "household_id": null,
                "name": "testcategory",
                "created_by_id": null,
            };

            //Add a category
            yield queries.categories.addOne(db, logger, [
                testCategory.household_id,
                testCategory.created_by_id,
                testCategory.name,
            ]);

            const rows = (yield db.query(logger, `
                SELECT *
                FROM categories
                WHERE name = '${testCategory.name}'
            `)).asPlainObjects();

            const actual = rows[0];
            const expected = testCategory;
            tap.strictSame(actual, expected, "Add a category");

            yield db.end();
        })();
    }));

    tap.test("duplicate insert", a(function* (tap) {

        yield a(function* () {
            yield resetTestingDb();

            const db = makeDatabase();

            const testCategory = {
                "category_id": 12,
                "household_id": null,
                "name": "testcategory",
                "created_by_id": null,
            };

            //Add a category, first insert should be good
            yield queries.categories.addOne(db, logger, [
                testCategory.household_id,
                testCategory.created_by_id,
                testCategory.name,
            ]);

            //Second should throw a DuplicateNameError
            try {
                const result = yield queries.categories.addOne(db, logger, [
                            testCategory.household_id,
                            testCategory.created_by_id,
                            testCategory.name,
                    ]);
            } catch (e) {
                tap.type(e, 'DuplicateNameError', "Duplicate category insert throws DuplicateNameError");
            }

            yield db.end();
        })();
    }));

    tap.end();
});
