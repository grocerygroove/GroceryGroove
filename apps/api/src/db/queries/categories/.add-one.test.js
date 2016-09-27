const makeDatabase = require("../../make-database");
const db = makeDatabase(process.env.TESTDBCONNSTRING);
const tap = require("tap");

tap.test("db/queries/categories/add-one", tap => {

    //console.log(db.query("SELECT * FROM Categories"));
    tap.equal(1, 1, "test");
    tap.end();
});
