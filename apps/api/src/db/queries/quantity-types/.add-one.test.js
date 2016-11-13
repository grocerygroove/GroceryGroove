require('dotenv').load();
global.Promise = require("bluebird");
const a = require("../../../utils/asyncify");
const makeDatabaseReal = require("database-connection");
const resetTestingDb = require("../../../utils/reset-testing-database");
const defaultTestUser = require("../../../utils/default-test-user");
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

tap.test("db/queries/quantity-types/add-one", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };

    tap.test("clean insert", a(function* (tap) {
        yield resetTestingDb();

        const db = makeDatabase();

        const qtToAdd = {
            "quantity_type_id": 10,
            "singular_name": "bit",
            "plural_name": "bits",
            "singular_abbreviation": "bt",
            "plural_abbreviation": "bts",
        };

        //Add one to default user's houshold
        yield queries.quantityTypes.addOne(db, logger, {
            householdId: defaultTestUser.primary_household_id,
            singularName: qtToAdd.singular_name,
            pluralName: qtToAdd.plural_name,
            singularAbbreviation: qtToAdd.singular_abbreviation,
            pluralAbbreviation: qtToAdd.plural_abbreviation,
        });

        const rows = (yield db.query(logger, `
            SELECT *
            FROM quantity_types
            WHERE singular_name = '${qtToAdd.singular_name}'
                AND plural_name = '${qtToAdd.plural_name}'
                AND singular_abbreviation = '${qtToAdd.singular_abbreviation}'
                AND plural_abbreviation = '${qtToAdd.plural_abbreviation}'
                AND household_id = '${defaultTestUser.primary_household_id}'
        `)).asPlainObjects();

        const actual = rows[0];
        const expected = Object.assign({}, qtToAdd, {
            "household_id": defaultTestUser.primary_household_id,
        });

        tap.strictSame(actual, expected, "Add a quantity-type");

        yield db.end();
    }));

    tap.test("duplicate insert", a(function* (tap) {
        yield resetTestingDb();

        const db = makeDatabase();

        const qtToAdd = {
            "quantity_type_id": 10,
            "singular_name": "bit",
            "plural_name": "bits",
            "singular_abbreviation": "bt",
            "plural_abbreviation": "bts",
        };

        //Add a quantity-type, first insert should be good
        yield queries.quantityTypes.addOne(db, logger, {
            householdId: defaultTestUser.primary_household_id,
            singularName: qtToAdd.singular_name,
            pluralName: qtToAdd.plural_name,
            singularAbbreviation: qtToAdd.singular_abbreviation,
            pluralAbbreviation: qtToAdd.plural_abbreviation,
        });

        try {
            yield queries.quantityTypes.addOne(db, logger, {
                householdId: defaultTestUser.primary_household_id,
                singularName: qtToAdd.singular_name,
                pluralName: qtToAdd.plural_name,
                singularAbbreviation: qtToAdd.singular_abbreviation,
                pluralAbbreviation: qtToAdd.plural_abbreviation,
            });
        } catch (e) {
            tap.type(e, 'DuplicateNameError', 'Duplicate quantity type insert throws DuplicateNameError');
        }

        yield db.end();


    }));


    tap.end();
});
