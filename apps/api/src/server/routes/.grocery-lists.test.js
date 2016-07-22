const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const tap = require("tap");

tap.test("server/routes/grocery-lists", tap => {
    const logger = {};
    const next = () => {};

    tap.test("GET /grocery-lists", a(function* (tap) {
        const handler = getRoute(rootGroup, "GET", "/grocery-lists").handler;

        yield a(function* () {

            const ctx = {
                state: {
                    householdId: 1,
                    userId: 1,
                },
                body: {},
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "grocery-lists/get-all") {
                        return [
                            {
                                groceryListId: 1,
                                createdById: 1,
                                name: "Test Grocery List One",
                                createdAt: "1998-01-01",
                                completedAt: void(0),
                                lastTouched: "1999-01-01",
                            },
                            {
                                groceryListId: 2,
                                createdById: 2,
                                name: "Test Grocery List Two",
                                createdAt: "1999-01-01",
                                completedAt: void(0),
                                lastTouched: "2000-01-01",
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.body.groceryLists;
            const expected = [
                            {
                                groceryListId: 1,
                                createdById: 1,
                                name: "Test Grocery List One",
                                createdAt: "1998-01-01",
                                completedAt: void(0),
                                lastTouched: "1999-01-01",
                            },
                            {
                                groceryListId: 2,
                                createdById: 2,
                                name: "Test Grocery List Two",
                                createdAt: "1999-01-01",
                                completedAt: void(0),
                                lastTouched: "2000-01-01",
                            },
                    ];

            tap.strictDeepEquals(actual, expected, "Get all grocery lists");
        })();

    }));

    tap.test("GET /grocery-lists/:id", a(function* (tap) {
        const handler = getRoute(rootGroup, "GET", "/grocery-lists/:id").handler;


        yield a(function* () {

            const ctx = {
                state: {
                    householdId: 1,
                    userId: 1,
                },
                body: {},
                id: "1",
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "grocery-lists/get-one") {
                        return [
                                {
                                    groceryListId: 1,
                                    createdById: 1,
                                    name: "Test Grocery List One",
                                    createdAt: "1998-01-01",
                                    completedAt: void(0),
                                    lastTouched: "1999-01-01",
                                },
                            ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);


            const actual = ctx.body.groceryList;
            const expected = {
                                    groceryListId: 1,
                                    createdById: 1,
                                    name: "Test Grocery List One",
                                    createdAt: "1998-01-01",
                                    completedAt: void(0),
                                    lastTouched: "1999-01-01",
                                };

            tap.strictDeepEquals(actual, expected, "Get one grocery list");
        })();

        yield a(function* () {

            const ctx = {
                state: {
                    householdId: 1,
                    userId: 1,
                },
                body: {},
                throw: (status) => {
                    ctx.status = status;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "grocery-lists/get-one") {
                        return [
                                {
                                    groceryListId: 1,
                                    createdById: 1,
                                    name: "Test Grocery List One",
                                    createdAt: "1998-01-01",
                                    completedAt: void(0),
                                    lastTouched: "1999-01-01",
                                },
                            ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);


            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing id results in a status of 400");
        })();

       yield a(function* () {

            const ctx = {
                state: {
                    householdId: 1,
                    userId: 1,
                },
                body: {},
                throw: (status) => {
                    ctx.status = status;
                },
                id: "notadigit",
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "grocery-lists/get-one") {
                        return [
                                {
                                    groceryListId: 1,
                                    createdById: 1,
                                    name: "Test Grocery List One",
                                    createdAt: "1998-01-01",
                                    completedAt: void(0),
                                    lastTouched: "1999-01-01",
                                },
                            ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);


            const actual = ctx.status;
            const expected = 400;

            tap.strictDeepEquals(actual, expected, "Non digit id results in a status of 400");
        })();

    }));

    tap.test("POST /grocery-lists", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/grocery-lists").handler;

        yield a(function* () {

            const ctx = {
                state: {
                    householdId: 1,
                    userId: 1,
                },
                body: {},
                request: {
                    body: {
                        name: "Test List",
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "grocery-lists/add-one") {
                        return [
                            {
                                groceryListId: 1,
                            },
                        ];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.body.groceryListId;
            const expected = 1;

            tap.strictEquals(actual, expected, "Create a grocery list");

        })();

        yield a(function* () {

            const ctx = {
                state: {
                    householdId: 1,
                    userId: 1,
                },
                body: {},
                request: {
                    body: {
                        name: "Test List",
                    },
                },
                throw: (status) => {
                    ctx.status = status;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "grocery-lists/add-one") {
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

        yield a(function* () {

            const ctx = {
                state: {
                    householdId: 1,
                    userId: 1,
                },
                body: {},
                request: {
                    body: {
                        name: "Test List",
                    },
                },
                throw: (status) => {
                    ctx.status = status;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if (name === "grocery-lists/add-one") {
                        return [];
                    }
                    return void(0);
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 401;

            tap.strictEquals(actual, expected, "Empty result set results in an status of 401");

        })();
    }));

    tap.end();
});
