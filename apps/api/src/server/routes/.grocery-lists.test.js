const a = require("../../utils/asyncify");
const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const tap = require("tap");

tap.test("server/routes/grocery-lists", tap => {
    const logger = {
        info: () => {},
        child: () => { return logger; },
    };
    const next = () => {};

    const messenger = {
        addMessage: (message) => Promise.resolve("OK"),
    };
    const cacher = {
        get: (key) => Promise.resolve(void(0)),
        set: (key, value) => Promise.resolve(void(0)),
        del: (key) => Promise.resolve(void(0)),
    };

    tap.test("GET /grocery-lists", a(function* (tap) {
        const handler = getRoute(rootGroup, "GET", "/grocery-lists").handler;

        yield a(function* () {

            const ctx = {
                body: {
                },

                services: {
                    cacher,
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/get-all") {
                                return [
                                    {
                                        "grocery_list_id": 1,
                                        "created_by_id": 1,
                                        "name": "Test Grocery List One",
                                        "created_at": "1998-01-01",
                                        "completed_at": void(0),
                                        "last_touched": "1999-01-01",
                                    },
                                    {
                                        "grocery_list_id": 2,
                                        "created_by_id": 2,
                                        "name": "Test Grocery List Two",
                                        "created_at": "1999-01-01",
                                        "completed_at": void(0),
                                        "last_touched": "2000-01-01",
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
                    userId: 1,
                },
            };


            yield handler(ctx, next);

            const actual = ctx.body.grocery_lists;
            const expected = [
                            {
                                "grocery_list_id": 1,
                                "created_by_id": 1,
                                "name": "Test Grocery List One",
                                "created_at": "1998-01-01",
                                "completed_at": void(0),
                                "last_touched": "1999-01-01",
                            },
                            {
                                "grocery_list_id": 2,
                                "created_by_id": 2,
                                "name": "Test Grocery List Two",
                                "created_at": "1999-01-01",
                                "completed_at": void(0),
                                "last_touched": "2000-01-01",
                            },
                    ];

            tap.strictDeepEquals(actual, expected, "Get all grocery lists");
        })();

    }));

    tap.test("GET /grocery-lists/:id", a(function* (tap) {
        const handler = getRoute(rootGroup, "GET", "/grocery-lists/:id").handler;


        yield a(function* () {

            const ctx = {
                body: {
                },

                id: "1",

                services: {
                    cacher,
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/get-one") {
                                return [
                                        {
                                            "grocery_list_id": 1,
                                            "created_by_id": 1,
                                            "name": "Test Grocery List One",
                                            "created_at": "1998-01-01",
                                            "completed_at": void(0),
                                            "last_touched": "1999-01-01",
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
                    userId: 1,
                },
            };


            yield handler(ctx, next);


            const actual = ctx.body.grocery_list;
            const expected = {
                                    "grocery_list_id": 1,
                                    "created_by_id": 1,
                                    "name": "Test Grocery List One",
                                    "created_at": "1998-01-01",
                                    "completed_at": void(0),
                                    "last_touched": "1999-01-01",
                                };

            tap.strictDeepEquals(actual, expected, "Get one grocery list");
        })();

        yield a(function* () {

            const ctx = {
                body: {
                },

                services: {
                    cacher,
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/get-one") {
                                return [
                                        {
                                            "grocery_list_id": 1,
                                            "created_by_id": 1,
                                            "name": "Test Grocery List One",
                                            "created_at": "1998-01-01",
                                            "completed_at": void(0),
                                            "last_touched": "1999-01-01",
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
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };


            yield handler(ctx, next);


            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing id results in a status of 400");
        })();

       yield a(function* () {

            const ctx = {
                body: {
                },

                id: "notadigit",

                services: {
                    cacher,
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/get-one") {
                                return [
                                        {
                                            "grocery_list_id": 1,
                                            "created_by_id": 1,
                                            "name": "Test Grocery List One",
                                            "created_at": "1998-01-01",
                                            "completed_at": void(0),
                                            "last_touched": "1999-01-01",
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
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };


            yield handler(ctx, next);


            const actual = ctx.status;
            const expected = 400;

            tap.strictDeepEquals(actual, expected, "Non digit id results in a status of 400");
        })();

    }));


    tap.test("POST /grocery-lists", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/grocery-lists").handler;

        yield a(function* () {

            const ctx = {
                body: {
                },

                request: {
                    body: {
                        name: "Test List",
                    },
                },

                services: {
                    cacher,
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/add-one") {
                                return [
                                    {
                                        "grocery_list_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                    messenger,
                },

                state: {
                    householdId: 1,
                    userId: 1,
                },
            };


            yield handler(ctx, next);

            const actual = ctx.body.grocery_list_id;
            const expected = 1;

            tap.strictEquals(actual, expected, "Create a grocery list");

        })();

        yield a(function* () {

            const ctx = {
                body: {
                },

                request: {
                    body: {
                        name: "Test List",
                    },
                },

                services: {
                    cacher,
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/add-one") {
                                throw new DuplicateNameError();
                            }
                            return void(0);
                        }),
                    },
                    logger,
                    messenger,
                },

                state: {
                    householdId: 1,
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a status of 400");

        })();

        yield a(function* () {

            const ctx = {
                body: {
                },

                request: {
                    body: {
                        name: "Test List",
                    },
                },

                services: {
                    cacher,
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/add-one") {
                                return [];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                    messenger,
                },

                state: {
                    householdId: 1,
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };


            yield handler(ctx, next);

            const actual = ctx.status;
            const expected = 401;

            tap.strictEquals(actual, expected, "Empty result set results in an status of 401");

        })();
    }));


    tap.test("POST /grocery-lists/:id/item", a(function* (tap) {
        const handler = getRoute(rootGroup, "POST", "/grocery-lists/:id/item").handler;

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "1",

                request: {
                    body: {
                        "item_id": "1",
                        "quantity_type_id": "1",
                        "quantity": "2",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },
            };


            yield handler(ctx, next);

            const actual = ctx.body.grocery_list_item_id;
            const expected = 1;

            tap.strictEquals(actual, expected, "Add an item to a grocery list");
        })();

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "1",

                request: {
                    body: {
                        "quantity_type_id": "1",
                        "quantity": "2",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing item_id results in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "1",

                request: {
                    body: {
                        "item_id": "notadigit",
                        "quantity_type_id": "1",
                        "quantity": "2",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Invalid item_id results in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "1",

                request: {
                    body: {
                        "item_id": "1",
                        "quantity": "2",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing quantity_type_id results in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "1",

                request: {
                    body: {
                        "item_id": "1",
                        "quantity_type_id": "notadigit",
                        "quantity": "2",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Invalid quantity_type_id results in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "1",

                request: {
                    body: {
                        "item_id": "1",
                        "quantity_type_id": "1",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing quantity results in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "1",

                request: {
                    body: {
                        "item_id": "1",
                        "quantity_type_id": "1",
                        "quantity": "notadigit",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Invalid quantity results in a status of 400");

        })();


        yield a(function* () {
            const ctx = {
                body: {
                },

                request: {
                    body: {
                        "item_id": "1",
                        "quantity_type_id": "1",
                        "quantity": "2",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Missing grocery list id in a status of 400");

        })();

        yield a(function* () {
            const ctx = {
                body: {
                },

                id: "grocList",

                request: {
                    body: {
                        "item_id": "1",
                        "quantity_type_id": "1",
                        "quantity": "2",
                    },
                },

                services: {
                    db: {
                        query: a(function* (logger, {
                            name,
                        }) {
                            if (name === "grocery-lists/items/add-one") {
                                return [
                                    {
                                        "grocery_list_item_id": 1,
                                    },
                                ];
                            }
                            return void(0);
                        }),
                    },
                    logger,
                },

                state: {
                    userId: 1,
                },

                throw: (status) => {
                    ctx.status = status;
                },
            };

            yield handler(ctx, next);
            const actual = ctx.status;
            const expected = 400;

            tap.strictEquals(actual, expected, "Invalid grocery list id results in a status of 400");

        })();
    }));

    tap.end();
});
