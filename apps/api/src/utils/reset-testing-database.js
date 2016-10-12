const a = require("./asyncify");
const execp = require("./execp");
const queries = require("../db/queries");
const makeDatabaseReal = require("database-connection");
const defaultTestUser = require("./default-test-user");

const makeDatabase = makeDatabaseReal.bind(null, {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
});

module.exports = a(function* resetTestingDatabase () {
    if (process.env.NODE_ENV !== "development") {
        throw new Error("must be in dev env to reset test db");
    }

    //Reset the database
    yield execp(`/bin/migrate downtesting`);
    yield execp(`/bin/migrate uptesting`);


    const logger = {
        info: () => {},
        child: () => { return logger; },
    };
    //Create test user
    const db = makeDatabase();
    yield queries.users.createUserAndHouseholdByEmail(db, logger, [
        defaultTestUser.email,
        defaultTestUser.password,
    ]);

    yield db.end();
});
