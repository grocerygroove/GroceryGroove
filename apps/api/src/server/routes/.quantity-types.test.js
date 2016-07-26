const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/quantity-types", tap => {
    const logger = {};
    const next = () => {};

    tap.test("GET /quantity-types", a(function* (tap) {

        yield a(function* () {
            const handler = getRoute(rootGroup, "GET", "/quantity-types").handler;
            const ctx = {
                state: {
                    userId: 1,
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "quantity-types/get-all") {
                        return [
                            {
                                quantity_type_id: 1,
                                singular_name: "piece",
                                plural_name: "pieces",
                                singular_abbreviation: "pc",
                                plural_abbreviation: "pcs",
                                household_id: void(0),
                            },
                            {
                                quantity_type_id: 2,
                                singular_name: "cup",
                                plural_name: "cups",
                                singular_abbreviation: void(0),
                                plural_abbreviation: void(0),
                                household_id: void(0),
                            },
                            {
                                quantity_type_id: 3,
                                singular_name: "gallon",
                                plural_name: "gallons",
                                singular_abbreviation: "gal",
                                plural_abbreviation: void(0),
                                household_id: void(0),
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);
            const actual = ctx.body.quantityTypes;
            const expected = [
                            {
                                quantity_type_id: 1,
                                singular_name: "piece",
                                plural_name: "pieces",
                                singular_abbreviation: "pc",
                                plural_abbreviation: "pcs",
                                household_id: void(0),
                            },
                            {
                                quantity_type_id: 2,
                                singular_name: "cup",
                                plural_name: "cups",
                                singular_abbreviation: void(0),
                                plural_abbreviation: void(0),
                                household_id: void(0),
                            },
                            {
                                quantity_type_id: 3,
                                singular_name: "gallon",
                                plural_name: "gallons",
                                singular_abbreviation: "gal",
                                plural_abbreviation: void(0),
                                household_id: void(0),
                            },
                        ];

            tap.strictDeepEquals(actual, expected, "Get quantity types");
        })();
    }));

    tap.test("POST /quantity-types", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/quantity-types").handler;

        yield a(function* () {
            const ctx = {
                state: {
                    householdId: 1,
                },
                request: {
                    body: {
                        singularName: "ounce",
                        pluralName: "ounces",
                        singularAbbreviation: "oz",
                        pluralAbbreviation: void(0),
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "quantity-types/add-one") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);
            const actual = ctx.status;
            const expected = 200;

            tap.strictEquals(actual, expected, "Good data inserts and returns a status of 200");

        })();

        yield a(function* () {
            const ctx = {
                state: {
                    householdId: 1,
                },
                request: {
                    body: {
                        pluralName: "ounces",
                        singularAbbreviation: "oz",
                        pluralAbbreviation: void(0),
                    },
                },
                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "quantity-types/add-one") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing singular_name results in a status of 400");
        })();

        yield a(function* () {
            const ctx = {
                state: {
                    householdId: 1,
                },
                request: {
                    body: {
                        singularName: "ounce",
                        pluralName: "ounces",
                        singularAbbreviation: "oz",
                        pluralAbbreviation: void(0),
                    },
                },
                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "quantity-types/add-one") {
                        throw new DuplicateNameError();
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a 400 status");
        })();
    }));
    tap.end();
});
