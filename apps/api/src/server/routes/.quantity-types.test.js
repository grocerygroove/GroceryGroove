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
                                quantityTypeId: 1,
                                singularName: "piece",
                                pluralName: "pieces",
                                singularAbbreviation: "pc",
                                pluralAbbreviation: "pcs",
                                householdId: void(0),
                            },
                            {
                                quantityTypeId: 2,
                                singularName: "cup",
                                pluralName: "cups",
                                singularAbbreviation: void(0),
                                pluralAbbreviation: void(0),
                                householdId: void(0),
                            },
                            {
                                quantityTypeId: 3,
                                singularName: "gallon",
                                pluralName: "gallons",
                                singularAbbreviation: "gal",
                                pluralAbbreviation: void(0),
                                householdId: void(0),
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);
            const actual = ctx.body.quantity_types;
            const expected = [
                            {
                                quantityTypeId: 1,
                                singularName: "piece",
                                pluralName: "pieces",
                                singularAbbreviation: "pc",
                                pluralAbbreviation: "pcs",
                                householdId: void(0),
                            },
                            {
                                quantityTypeId: 2,
                                singularName: "cup",
                                pluralName: "cups",
                                singularAbbreviation: void(0),
                                pluralAbbreviation: void(0),
                                householdId: void(0),
                            },
                            {
                                quantityTypeId: 3,
                                singularName: "gallon",
                                pluralName: "gallons",
                                singularAbbreviation: "gal",
                                pluralAbbreviation: void(0),
                                householdId: void(0),
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

            tap.strictEquals(actual, expected, "Missing singularName results in a status of 400");
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
