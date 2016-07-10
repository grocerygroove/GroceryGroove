const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/categories",

    middleware: [
        "jwtAuth",
        "householdExtractor",
    ],

    routes: [
        {
            method: "GET",

            deps: [
                "db",
                "logger",
            ],

            handler: a(function* (db, logger, ctx, next) {
                ctx.body = {
                    category_names: yield queries.categories.getAllNames(db, logger, [
                        ctx.state.householdId,
                    ]),
                };
            }),
        },
    ],
};
