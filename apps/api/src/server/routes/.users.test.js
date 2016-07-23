const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/users", tap => {

    const logger = {};
    const next = () => {};

    tap.test("PUT /users/upgrade", a(function* (tap) {
        const handler = getRoute(rootGroup, "PUT", "/users/upgrade").handler;

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                },
                request: {
                    body: {
                        email: "testemail@test.com",
                        password: "testpassword",
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/convert-to-full-account") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 200;

            tap.strictEquals(actual, expected, "Valid put results in a status of 200");
        })();

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                },
                request: {
                    body: {
                        email: "testemail@test.com",
                    },
                },
                throw: function (statusCode) {
                    this.status = statusCode;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/convert-to-full-account") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing password in body results in a status of 400");
        })();

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                },
                request: {
                    body: {
                        password: "testpassword",
                    },
                },
                throw: function (statusCode) {
                    this.status = statusCode;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/convert-to-full-account") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing email in body results in a status of 400");
        })();



    }));


    tap.end();
});
