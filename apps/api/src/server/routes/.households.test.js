const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/households", tap => {
    const logger = {};
    const next = () => {};


    tap.test("GET /households", a(function* (tap) {
        yield a(function* () {
            const handler = getRoute(rootGroup, "GET", "/households").handler;
            const ctx = {
                state: {
                    householdId: 1,
                },
                body: {},
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "households/get-household-info") {
                        return [
                            {
                                "name": "Test House",
                                "admin": "testadmin@test.com",
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);
            const actual = ctx.body.household_info;
            const expected = {
                name: "Test House",
                admin: "testadmin@test.com",
            };

            tap.strictDeepEquals(actual, expected, "Get household on a valid household return householdInfo object");
        })();


    }));

    tap.test("POST /households", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/households").handler;

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                },
                request: {
                    body: {
                        name: "Household Name",
                    },
                },
                body: {},
            };

            const db = {
                    query: a(function* (logger, {
                        name,
                    }) {
                        if (name === "households/add-one") {
                            return [
                                {
                                    "household_id": 3,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.body.household_id;
            const expected = 3;

            tap.strictEquals(actual, expected, "Successful household creation returns a body with a householdId");

        })();

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                },
                request: {
                    body: {},
                },
                body: {},
                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };

            const db = {
                    query: a(function* (logger, {
                        name,
                    }) {
                        if (name === "households/add-one") {
                            return [
                                {
                                    "household_id": 3,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing household name in request body results in a status of 400");

        })();


    }));

    tap.test("GET /households/users", a(function* (tap) {

        yield a(function* () {
            const handler = getRoute(rootGroup, "GET", "/households/users").handler;
            const ctx = {
                state: {
                    householdId: 1,
                },
                body: {},
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "users/get-users-in-household") {
                        return [
                            {
                                "user_id": 1,
                                "identifier": "test@test.com",
                            },
                            {
                                "user_id": 2,
                                "identifier": "deviceID123467",
                            },
                            {
                                "user_id": 3,
                                "identifier": "test2@test123.com",
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.body.household_users;
            const expected = [
                            {
                                "user_id": 1,
                                "identifier": "test@test.com",
                            },
                            {
                                "user_id": 2,
                                "identifier": "deviceID123467",
                            },
                            {
                                "user_id": 3,
                                "identifier": "test2@test123.com",
                            },
                        ];

            tap.strictDeepEquals(actual, expected, "Returns a list of user objects");

        })();

    }));

    tap.test("DELETE /households/users", a(function* (tap) {
        const handler = getRoute(rootGroup, "DELETE", "/households/users").handler;

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {
                        "user_id": 1,
                    },
                },
            };

            const db = {
                    query: a(function* (logger, {
                        name,
                    }) {
                        if (name === "households/remove-user") {
                            return [
                                {
                                    "deleted_count": 1,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 200;

            tap.strictEquals(actual, expected, "Successful deletion results in a status of 200");
        })();

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: { },
                },
                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };

            const db = {
                    query: a(function* (logger, {
                        name,
                    }) {
                        if (name === "households/remove-user") {
                            return [
                                {
                                    "deleted_count": 0,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing userId in request body results in a status of 400");
        })();

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {
                        "user_id": 1,
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
                        if (name === "households/remove-user") {
                            return [
                                {
                                    "deleted_count": 0,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 401;

            tap.strictEquals(actual, expected, "Unsuccessful deletion results in a status of 401");
        })();

    }));

    tap.test("PUT /households/administrator", a(function* (tap) {
        const handler = getRoute(rootGroup, "PUT", "/households/administrator").handler;

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {
                        "user_id": 1,
                    },
                },
            };

            const db = {
                    query: a(function* (logger, {
                        name,
                    }) {
                        if (name === "households/set-administrator") {
                            return [
                                {
                                    "updated_count": 1,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 200;

            tap.strictEquals(actual, expected, "Successful promotion results in a status of 200");

        })();

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {
                        "user_id": 1,
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
                        if (name === "households/set-administrator") {
                            return [
                                {
                                    "updated_count": 0,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 401;

            tap.strictEquals(actual, expected, "Update affecting 0 rows results in a status of 401");

        })();

        yield a(function* () {
            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {},
                },
                throw: statusCode => {
                    ctx.status = statusCode;
                },
            };

            const db = {
                    query: a(function* (logger, {
                        name,
                    }) {
                        if (name === "households/set-administrator") {
                            return [
                                {
                                    "updated_count": 0,
                                },
                            ];
                        }
                        return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing userId in request body results in a status of 400");

        })();

    }));

    tap.end();
});
