require('dotenv').load();
const defaultUser = require("../../../utils/default-test-user");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const secondaryUser = require("../../../utils/secondary-test-user");
const tap = require("tap");


const logger = {
  info: () => {},
  child: () => { return logger; },
};

tap.test("db/queries/grocery-lists/items/add-one", tap => {

  tap.assert(false, "Write this test");

  tap.end();
});
