const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/login", tap => {
    const logger = {};
    const next = () => {};
    const jwtService = {
        encode: function (data) {
            return {
                data,
            };
        },
    };
    tap.test("POST /login/by-email", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/login/by-email").handler;

        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        email: "test@test.com",
                        password: "testpass",
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/check-by-email") {
                        return [
                            {
                                user_id: 1,
                            },
                         ];
                    }
                    return void(0);
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
            const ctx = {
                request: {
                    body: {
                        email: "test@test.com",
                        password: "testpass",
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/check-by-email") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, jwtService, logger, ctx, next);

            const actual = ctx.status;
            const expected = 403;

            tap.strictEqual(actual, expected, "Convert an invalid userid to an error");
        })();





    }));

    tap.test("POST /login/by-device-identifier", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/login/by-device-identifier").handler;

        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        deviceIdentifier: "testdeviceid",
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/check-by-device-identifier") {
                        return [
                            {
                                user_id: 1,
                            },
                         ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, jwtService, logger, ctx, next);

            const actual = ctx.body.token.data;
            const expected = {
                userId: 1,
            };

            tap.strictDeepEquals(actual, expected, "Convert a valid deviceid to a token");
        })();

        yield a(function* () {
            const ctx = {
                request: {
                    body: {
                        deviceIdentifier: "testdeviceid",
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/check-by-device-identifier") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, jwtService, logger, ctx, next);

            const actual = ctx.status;
            const expected = 403;

            tap.strictEqual(actual, expected, "Convert an invalid deviceid to an error");
        })();
     }));

    tap.end();
});
