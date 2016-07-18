const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/categories", tap => {
    tap.test("GET /categories", a(function* (tap){
        const logger = {};
        const next = () => {};

        yield a(function* (){
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
                        return [ "cleaners",
                                 "dairy",
                                 "produce",
                                 "meats"];
                    }
                }),
            };

            yield handler(db, logger, ctx, next);

            const actual = ctx.body.category_names;
            const expected = ["cleaners",
                              "dairy",
                              "produce",
                              "meats"];
            tap.strictDeepEquals(actual, expected, "Get list of categories");

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
                        return [ {
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
            const expected = [ {
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
