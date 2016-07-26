const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/households",

    middlewares: [
        "jwtAuth",
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

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
            },

            handler: a(function* (db, logger, ctx, next) {
                const householdId = ctx.state.householdId;

                ctx.body = {
                    "household_info": yield queries.households.getHouseholdInfo(db, logger, [
                        householdId,
                    ]),
                };
            }),
        },
        {
            method: "POST",
            path: "/",

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "name",
                    in: "body",
                    required: "true",
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
            },


            handler: a(function* (db, logger, ctx, next) {
                const householdName = ctx.request.body.name;

                if (!householdName) {
                    ctx.throw(400, "Must include household name in request body");
                } else {
                    ctx.body = {
                        "household_id": yield queries.households.addOne(db, logger, [
                            ctx.state.userId,
                            householdName,
                        ]),
                    };
                }
            }),
        },
        {
            method: "GET",
            path: "/users",

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
            },

            handler: a(function* (db, logger, ctx, next) {
                const householdId = ctx.state.householdId;

                ctx.body = {
                    "household_users": yield queries.users.getUsersInHousehold(db, logger, [
                        householdId,
                    ]),
                };
            }),
        },
        {
            method: "DELETE",
            path: "/users",

            parameters: [
                {
                    name: "user_id",
                    in: "body",
                    description: "UserId to remove",
                    required: "true",
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
                401: {},
            },

            handler: a(function* (db, logger, ctx, next) {
                const userToRemove = ctx.request.body.user_id;

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
        {
            method: "PUT",
            path: "/administrator",

            parameters: [
                {
                    name: "user_id",
                    in: "body",
                    description: "UserId to remove",
                    required: "true",
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
                401: {},
            },

            handler: a(function* (db, logger, ctx, next) {
                const userToPromote = ctx.request.body.user_id;

                if (!userToPromote) {
                    ctx.throw(400, "Must include userId in request body");
                } else {
                    const affected = yield queries.households.setAdministrator(db, logger, [
                        ctx.state.userId,
                        userToPromote,
                        ctx.state.householdId,
                    ]);

                    if (affected && affected === 1) {
                        ctx.status = 200;
                    } else {
                        ctx.throw(401, "User lacks permissions to perform promotion");
                    }
                }
            }),
        },
    ],
};
