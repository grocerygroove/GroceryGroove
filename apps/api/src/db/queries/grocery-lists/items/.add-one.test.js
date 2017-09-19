require('dotenv').load();
const Pool = require('pg').Pool;
const queries = require("../../../queries");
const resetTestingDb = require("../../../../utils/reset-testing-database");
const tap = require("tap");


const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/grocery-lists/items/add-one", tap => {

  tap.assert(false, "Write this test");

  tap.end();
});
