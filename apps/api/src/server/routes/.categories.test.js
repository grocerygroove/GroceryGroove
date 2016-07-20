const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const tap = require("tap");

tap.test("server/routes/categories", tap => {
    tap.test("GET /categories", a(function* (tap) {
        const logger = {};
        const next = () => {};

        yield a(function* () {
            const handler = getRoute(rootGroup, "GET", "/categories").handler;

            const ctx = {
                state: {
                    householdId: 1
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if(name === "categories/get-all-names"){
                        return [
                            "cleaners",
                            "dairy",
                            "produce",
                            "meats",
                        ];
                    }
                }),
            };

            yield handler(db, logger, ctx, next);

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
        const logger = {};
        const next = () => {};

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/categories").handler;

            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {
                        name: "test category",
                    },
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if(name === "categories/add-one"){
                        return [];
                    }
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 200;
            tap.strictEquals(actual, expected, "Good data inserts and returns a status of 200");
        })();

        yield a(function* (){
            const handler = getRoute(rootGroup, "POST", "/categories").handler;

            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {
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
                    if(name === "categories/add-one"){
                        return [];
                    }
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;
            tap.strictEquals(actual, expected, "Missing category name results in a 400 status");
        })();

        yield a(function* (){
            const handler = getRoute(rootGroup, "POST", "/categories").handler;

            const ctx = {
                state: {
                    userId: 1,
                    householdId: 1,
                },
                request: {
                    body: {
                        name: "test category",
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
                    if(name === "categories/add-one"){
                        throw new DuplicateNameError();
                    }
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.status;
            const expected = 400;
            tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a 400 status");
        })();
    }));

    tap.test("GET /categories/info", a(function* (tap){
        const logger = {};
        const next = () => {};

        yield a(function* (){
            const handler = getRoute(rootGroup, "GET", "/categories/info").handler;

            const ctx = {
                state: {
                    householdId: 1
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if(name === "categories/get-all"){
                        return [
                            {
                                category_id: 1,
                                household_id: 1,
                                name: "beans",
                            },
                            {
                                category_id: 2,
                                household_id: 1,
                                name: "pork",
                            },
                            {
                                category_id: 3,
                                household_id: 1,
                                name: "bleach",
                            },
                        ];
                    }
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.body.categories;
            const expected = [
                {
                    category_id: 1,
                    household_id: 1,
                    name: "beans",
                },
                {
                    category_id: 2,
                    household_id: 1,
                    name: "pork",
                },
                {
                    category_id: 3,
                    household_id: 1,
                    name: "bleach",
                },
            ];

            tap.strictDeepEquals(actual, expected, "Get categories info");
        })();
    }));

    tap.end();
});
