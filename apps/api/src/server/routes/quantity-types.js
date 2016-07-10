const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/quantity-types",

    middlewares: [
        "jwtAuth",
        "householdExtractor",
    ],

    routes: [
        {
            method: "GET",
            path: "/",

            deps: [
                "db",
                "logger",
            ],

            handler: a(function* (db, logger, ctx, next) {
                const userId = ctx.state.token.userId;

                ctx.body = {
                    quantity_types: yield queries.quantityTypes.getAll(db, logger, [
                        userId,
                    ]),
                };
            }),
        },
    ],
};
