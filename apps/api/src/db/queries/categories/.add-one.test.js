require('dotenv').load();
const a = require("../../../utils/asyncify");
const makeDatabase = require("../../make-database");
const db = makeDatabase(process.env.TESTDBCONNSTRING);
const resetTestingDb = require("../../../../testing/reset-testing-db");
const queries = require("../../queries");
const tap = require("tap");

tap.test("db/queries/categories/add-one", a(function* (tap) {
    const logger = {
        info: ()=>{},
    };


    yield a(function* () {
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
        const rows = yield db.query(logger, `SELECT * FROM Categories WHERE name = '${testCategory.name}'`);
        yield resetTestingDb();

        const actual = rows[0];
        const expected = testCategory;
        tap.strictDeepEquals(actual, expected, "test");
    })();


    tap.end();
}));
