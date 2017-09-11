require('dotenv').load();
global.Promise = require("bluebird");
const defaultTestUser = require("../../../utils/default-test-user");
const DuplicateNameError = require("../../../errors/duplicate-name-error");
const resetTestingDb = require("../../../utils/reset-testing-database");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const tap = require("tap");

tap.test("db/queries/quantity-types/add-one", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };

  tap.test("clean insert", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const qtToAdd = {
      "quantity_type_id": 10,
      "singular_name": "bit",
      "plural_name": "bits",
      "singular_abbreviation": "bt",
      "plural_abbreviation": "bts",
    };

    //Add one to default user's houshold
    await queries.quantityTypes.addOne(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      singularName: qtToAdd.singular_name,
      pluralName: qtToAdd.plural_name,
      singularAbbreviation: qtToAdd.singular_abbreviation,
      pluralAbbreviation: qtToAdd.plural_abbreviation,
    });

    const rows = (await db.query({
      text: `
            SELECT *
            FROM quantity_types
            WHERE singular_name = '${qtToAdd.singular_name}'
                AND plural_name = '${qtToAdd.plural_name}'
                AND singular_abbreviation = '${qtToAdd.singular_abbreviation}'
                AND plural_abbreviation = '${qtToAdd.plural_abbreviation}'
                AND household_id = '${defaultTestUser.primary_household_id}'`,
    })).rows;

    const actual = rows[0];
    const expected = Object.assign({}, qtToAdd, {
      "household_id": defaultTestUser.primary_household_id,
    });

    tap.same(actual, expected, "Add a quantity-type");

    await db.end();
  }));

  tap.test("duplicate insert", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const qtToAdd = {
      "quantity_type_id": 10,
      "singular_name": "bit",
      "plural_name": "bits",
      "singular_abbreviation": "bt",
      "plural_abbreviation": "bts",
    };

    //Add a quantity-type, first insert should be good
    await queries.quantityTypes.addOne(db, logger, {
      householdId: defaultTestUser.primary_household_id,
      singularName: qtToAdd.singular_name,
      pluralName: qtToAdd.plural_name,
      singularAbbreviation: qtToAdd.singular_abbreviation,
      pluralAbbreviation: qtToAdd.plural_abbreviation,
    });

    try {
      await queries.quantityTypes.addOne(db, logger, {
        householdId: defaultTestUser.primary_household_id,
        singularName: qtToAdd.singular_name,
        pluralName: qtToAdd.plural_name,
        singularAbbreviation: qtToAdd.singular_abbreviation,
        pluralAbbreviation: qtToAdd.plural_abbreviation,
      });
    } catch (e) {
      tap.type(e, 'DuplicateNameError', 'Duplicate quantity type insert throws DuplicateNameError');
    }

    await db.end();
  }));

  tap.end();
});
