const a = require("../../utils/asyncify");
const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const tap = require("tap");

tap.test("server/routes/categories", tap => {
    const logger = {
        info: () => {},
        child: () => logger,
    };

    tap.test("GET /categories", a(function* (tap) {

        const next = () => {};

        yield a(function* () {
            const handler = getRoute(rootGroup, "GET", "/categories").handler;

            const ctx = {
                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "categories/get-all-names") {
                                return [
                                    "cleaners",
                                    "dairy",
                                    "produce",
                                    "meats",
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    householdId: 1,
                },
            };


            yield handler(ctx, next);

            const actual = ctx.body.category_names;
            const expected = [
                "cleaners",
                "dairy",
                "produce",
                "meats",
            ];
            tap.strictDeepEquals(actual, expected, "Get list of categories");
        })();
    }));

    tap.test("POST /categories", a(function* (tap) {
        const next = () => {};

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/categories").handler;

            const ctx = {
                request: {
                    body: {
                        name: "test category",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "categories/add-one") {
                                return [];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                    householdId: 1,
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 200;
            tap.strictEquals(actual, expected, "Good data inserts and returns a status of 200");
        })();

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/categories").handler;

            const ctx = {
                request: {
                    body: {
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "categories/add-one") {
                                return [];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                    householdId: 1,
                },

                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 400;
            tap.strictEquals(actual, expected, "Missing category name results in a 400 status");
        })();

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/categories").handler;

            const ctx = {
                request: {
                    body: {
                        name: "test category",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "categories/add-one") {
                                throw new DuplicateNameError();
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                    householdId: 1,
                },

                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 400;
            tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a 400 status");
        })();
    }));

    tap.test("GET /categories/info", a(function* (tap) {
        const next = () => {};

        yield a(function* () {
            const handler = getRoute(rootGroup, "GET", "/categories/info").handler;

            const ctx = {
                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "categories/get-all") {
                                return [
                                    {
                                        "category_id": 1,
                                        "household_id": 1,
                                        "name": "beans",
                                    },
                                    {
                                        "category_id": 2,
                                        "household_id": 1,
                                        "name": "pork",
                                    },
                                    {
                                        "category_id": 3,
                                        "household_id": 1,
                                        "name": "bleach",
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    householdId: 1,
                },
            };


            yield handler(ctx, next);

            const actual = ctx.body.categories;
            const expected = [
                {
                    "category_id": 1,
                    "household_id": 1,
                    "name": "beans",
                },
                {
                    "category_id": 2,
                    "household_id": 1,
                    "name": "pork",
                },
                {
                    "category_id": 3,
                    "household_id": 1,
                    "name": "bleach",
                },
            ];

            tap.strictDeepEquals(actual, expected, "Get categories info");
        })();
    }));

    tap.end();
});
