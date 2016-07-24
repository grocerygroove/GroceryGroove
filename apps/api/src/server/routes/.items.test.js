const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/items", tap => {
    const logger = {};
    const next = () => {};

    tap.test("POST /items", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/items").handler;

        yield a(function* () {
            const ctx = {
                state: {
                    householdId: 2,
                },
                request: {
                    body: {
                        name: "Chicken",
                        description: void(0),
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "items/add-one") {
                        return [
                            {
                                itemId: 2,
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.body.itemId;
            const expected = 2;

            tap.strictEquals(actual, expected, "Item insert returns itemId in response body");

        })();

        yield a(function* () {
            const ctx = {
                state: {
                    householdId: 2,
                },
                request: {
                    body: {
                        description: void(0),
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
                    if (name === "items/add-one") {
                        return [
                            {
                                itemId: 2,
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing name in request body results in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                state: {
                    householdId: 2,
                },
                request: {
                    body: {
                        name: "Chicken",
                        description: void(0),
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
                    if (name === "items/add-one") {
                        throw new DuplicateNameError();
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a status of 400");

        })();

    }));

    tap.end();
});
