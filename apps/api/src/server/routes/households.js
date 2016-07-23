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
        {
            method: "DELETE",
            path: "/users",

            handler: a(function* (db, logger, ctx, next) {
                const userToRemove = ctx.request.body.userId;

                if (!userToRemove) {
                    ctx.throw(400, "Must include userId in request body");
                } else {
                    const affected = yield queries.households.removeUser(db, logger, [
                        ctx.state.userId,
                        userToRemove,
                        ctx.state.householdId,
                    ]);

                    if (affected && affected > 0) {
                        ctx.status = 200;
                    } else {
                        ctx.throw(401, "User lacks permissions to perform deletion");
                    }
                }
            }),
        },
    ],
};
