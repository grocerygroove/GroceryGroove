const a = require("../../utils/asyncify");
const queries = require("../../db/queries");
const transactions = require("../../db/transactions");
const cacheKeys = {
    getHouseholdKey: (householdId) => {
        return `getHousehold${householdId}`;
    },
};

module.exports = {
    path: "/households",

    middlewares: [
        "authJwt",
        "parseJsonBody",
        "extractHouseholdId",
        "extractUserId",
    ],

    services: [
        "cacher",
        "db",
        "logger",
        "messenger",
    ],

    routes: [
        {
            method: "get",
            path: "/",

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger, cacher } = ctx.services;
                const householdId = ctx.state.householdId;

                let response;
                const cacheKey = cacheKeys.getHouseholdKey(householdId);
                const cachedResult = yield cacher.get(cacheKey);
                if (cachedResult) {
                    response = cachedResult;
                } else {
                    response = {
                        "household_info": yield queries.households.getHouseholdInfo(db, logger, [
                            householdId,
                        ]),
                    };
                    yield cacher.set(cacheKey, response);
                }
                ctx.body = response;
            }),
        },
        {
            method: "post",
            path: "/",

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "name",
                    in: "body",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
            },


            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                const householdName = ctx.request.body.name;
                if (!householdName) {
                    ctx.throw(400, "Must include household name in request body");
                } else {
                    ctx.body = {
                        "household_id": (yield transactions.households.createForUser(db, logger, [
                            householdName,
                            ctx.state.userId,
                        ])),
                    };
                }
            }),
        },
        {
            method: "get",
            path: "/users",

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                const householdId = ctx.state.householdId;
                ctx.body = {
                    "household_users": yield queries.users.getUsersInHousehold(db, logger, [
                        householdId,
                    ]),
                };
            }),
        },
        {
            method: "delete",
            path: "/users",

            parameters: [
                {
                    name: "user_id",
                    in: "body",
                    description: "UserId to remove",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
                401: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

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
            method: "put",
            path: "/administrator",

            parameters: [
                {
                    name: "user_id",
                    in: "body",
                    description: "UserId to remove",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
                401: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

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
