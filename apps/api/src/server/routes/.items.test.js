const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/items", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };
    const next = () => {};

    tap.test("POST /items", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/items").handler;

        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        "name": "Chicken",
                        "category_id": 2,
                        "description": void(0),
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "items/add-and-categorize-one") {
                                return [
                                    {
                                        "item_id": 2,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    householdId: 2,
                },
            };


            yield handler(ctx, next);

            const actual = ctx.body.item_id;
            const expected = 2;

            tap.strictEquals(actual, expected, "Item insert returns itemId in response body");

        })();

        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        "category_id": 2,
                        "description": void(0),
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "items/add-and-categorize-one") {
                                return [
                                    {
                                        "item_id": 2,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    householdId: 2,
                },

                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing name in request body results in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        "name": "Chicken",
                        "description": void(0),
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "items/add-and-categorize-one") {
                                return [
                                    {
                                        "item_id": 2,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    householdId: 2,
                },

                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing categoryId in request body results in a status of 400");

        })();


        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        "name": "Chicken",
                        "category_id": 2,
                        "description": void(0),
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "items/add-and-categorize-one") {
                                throw new DuplicateNameError();
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    householdId: 2,
                },

                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a status of 400");

        })();

    }));

    tap.end();
});
