const tap = require("tap");

const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");

tap.test("server/routes/login", tap => {
    tap.test("POST /login/by-email", a(function* (tap) {
        const logger = {};
        const next = () => {};
        const jwtService = {
            encode: function (data) {
                return {
                    data,
                };
            },
        };

        const handler = getRoute(rootGroup, "POST", "/login/by-email").handler;

        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        email: "test@test.com",
                        password: "testpass",
                    }
                }
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/check-by-email") {
                        return [ { userId: 1 } ];
                    }
                }),
            };

            yield handler(db, jwtService, logger, ctx, next);

            const actual = ctx.body.token.data;
            const expected = {
                userId: 1,
            };

            tap.strictDeepEquals(actual, expected, "Convert a valid userid to a token");
        })();

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/login/by-email").handler;

            const ctx = {
                request: {
                    body: {
                        email: "test@test.com",
                        password: "testpass",
                    }
                }
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/check-by-email") {
                        return [];
                    }
                }),
            };

            yield handler(db, jwtService, logger, ctx, next);

            const actual = ctx.status;
            const expected = 403;

            tap.strictEqual(actual, expected, "Convert an invalid userid to an error");
        })();

        tap.end();
    }));

    tap.end();
});
