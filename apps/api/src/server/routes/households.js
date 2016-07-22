const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/households",

    middlewares: [
        "jsonBodyParser",
        "householdExtractor",
        "userExtractor",
    ],

    deps: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "GET",
            path: "/",

            handler: a(function* (db, logger, ctx, next) {
                const householdId = ctx.state.householdId;

                ctx.body = {
                    householdInfo: yield queries.households.getHouseholdInfo(db, logger, [
                        householdId,
                    ]),
                };
            }),
        },
        {
            method: "GET",
            path: "/users",

            handler: a(function* (db, logger, ctx, next) {
                const householdId = ctx.state.householdId;

                ctx.body = {
                    householdUsers: yield queries.users.getUsersInHousehold(db, logger, [
                        householdId,
                    ]),
                };
            }),
        },
    ],
};
