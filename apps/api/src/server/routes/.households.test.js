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
                                name: "Test House",
                                admin: "testadmin@test.com",
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

            tap.strictDeepEquals(actual, expected, "Get household on a valid household return household_info object");
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
                                user_id: 1,
                                identifier: "test@test.com",
                            },
                            {
                                user_id: 2,
                                identifier: "deviceID123467",
                            },
                            {
                                user_id: 3,
                                identifier: "test2@test123.com",
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
                                user_id: 1,
                                identifier: "test@test.com",
                            },
                            {
                                user_id: 2,
                                identifier: "deviceID123467",
                            },
                            {
                                user_id: 3,
                                identifier: "test2@test123.com",
                            },
                        ];

            tap.strictDeepEquals(actual, expected, "Returns a list of user objects");

        })();

    }));
    tap.end();
});
