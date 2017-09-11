require('dotenv').load();
global.Promise = require("bluebird");
const defaultTestUser = require("../../../utils/default-test-user");
const objectLike = require("../../../utils/object-like");
const Pool = require('pg').Pool;
const queries = require("../../queries");
const resetTestingDb = require("../../../utils/reset-testing-database");
const secondaryTestUser = require("../../../utils/secondary-test-user");
const tap = require("tap");

tap.test("db/queries/quantity-types/get-all", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };
  const defaultQuantityTypes = [
    {
      "quantity_type_id": 2,
      "singular_name": "cup",
      "plural_name": "cups",
      "singular_abbreviation": null,
      "plural_abbreviation": null,
      "household_id": null,
    },
    {
      "quantity_type_id": 3,
      "singular_name": "gallon",
      "plural_name": "gallons",
      "singular_abbreviation": "gal",
      "plural_abbreviation": null,
      "household_id": null,
    },
    {
      "quantity_type_id": 9,
      "singular_name": "gram",
      "plural_name": "grams",
      "singular_abbreviation": "g",
      "plural_abbreviation": null,
      "household_id": null,
    },
    {
      "quantity_type_id": 8,
      "singular_name": "liter",
      "plural_name": "liters",
      "singular_abbreviation": "l",
      "plural_abbreviation": null,
      "household_id": null,
    },
    {
      "quantity_type_id": 4,
      "singular_name": "ounce",
      "plural_name": "ounces",
      "singular_abbreviation": "oz",
      "plural_abbreviation": null,
      "household_id": null,
    },
    {
      "quantity_type_id": 1,
      "singular_name": "piece",
      "plural_name": "pieces",
      "singular_abbreviation": "pc",
      "plural_abbreviation": "pcs",
      "household_id": null,
    },
    {
      "quantity_type_id": 5,
      "singular_name": "pint",
      "plural_name": "pints",
      "singular_abbreviation": "pt",
      "plural_abbreviation": null,
      "household_id": null,
    },
    {
      "quantity_type_id": 7,
      "singular_name": "pound",
      "plural_name": "pounds",
      "singular_abbreviation": "lb",
      "plural_abbreviation": "lbs",
      "household_id": null,
    },
    {
      "quantity_type_id": 6,
      "singular_name": "quart",
      "plural_name": "quarts",
      "singular_abbreviation": "qt",
      "plural_abbreviation": null,
      "household_id": null,
    },
  ];


  tap.test("get all default", (async function (tap) {
    await resetTestingDb();

    const db = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    });

    const queriedRows = (await queries.quantityTypes.getAll(db, logger, {
      householdId: defaultTestUser.primary_household_id,
    }));

    tap.same(queriedRows, defaultQuantityTypes);

    await db.end();
  }));

  tap.test("add one, then get all", (async function (tap) {
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

    //Add one to secondary user's household
    await queries.quantityTypes.addOne(db, logger, {
      householdId: secondaryTestUser.primary_household_id,
      singularName: qtToAdd.singular_name,
      pluralName: qtToAdd.plural_name,
      singularAbbreviation: qtToAdd.singular_abbreviation,
      pluralAbbreviation: qtToAdd.plural_abbreviation,
    });

    //Should only have default users action
    const expected = [].concat([
      Object.assign({}, qtToAdd, {
        "household_id": defaultTestUser.primary_household_id,
      }),
    ], defaultQuantityTypes);

    const queriedRows = (await queries.quantityTypes.getAll(db, logger, {
      householdId: defaultTestUser.primary_household_id,
    }));

    tap.same(queriedRows, expected);

    await db.end();
  }));

  tap.end();
});
