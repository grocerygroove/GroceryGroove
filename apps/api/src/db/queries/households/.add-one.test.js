require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("database-connection");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
const queries = require("../../queries");
const transactions = require("../../transactions");
const DuplicateNameError = require("../../../errors/duplicate-name-error");

const makeDatabase = makeDatabaseReal.bind(null, {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
});

const tap = require("tap");

tap.test("db/queries/households/add-one", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    tap.test("add one", a(function* (tap) {
        yield a(function* () {
            yield resetTestingDb();

            const db = makeDatabase();
            const householdName = "Test House";


            const householdId = yield transactions.households.createForUser({db, logger}, [
                defaultTestUser.user_id,
                householdName,
            ]);

            const expected = {
                "household_id": 2,
                "name": householdName,
                "created_by_id": defaultTestUser.user_id,
                "household_admin": defaultTestUser.user_id,
            };

            const actual = (yield db.query(logger, `
                SELECT *
                FROM households
                WHERE household_id = '${householdId}'
            `)).asPlainObjects();

            console.log(actual);

            tap.strictDeepEquals(actual, expected);

            yield db.end();
        })();
    }));


    tap.end();
});
