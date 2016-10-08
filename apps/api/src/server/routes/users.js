const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/users",

    middlewares: [
        "jwtAuth",
        "jsonBodyParser",
        "userExtractor",
    ],

    deps: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "get",
            path: "/households",

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
            },

            handler: a(function* (db, logger, ctx, next) {
                ctx.body = {
                    households: yield queries.users.getUserHouseholds(db, logger, [
                        ctx.state.userId,
                    ]),
                };
            }),
        },
        {
            method: "put",
            path: "/upgrade",

            parameters: [
                {
                    name: "email",
                    in: "body",
                    required: true,
                    type: "string",
                },
                {
                    name: "password",
                    in: "body",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: a(function* (db, logger, ctx, next) {
                const email = ctx.request.body.email;
                const password = ctx.request.body.password;

                if (!email || !password) {
                    ctx.throw(400, "Must pass email and password");
                } else {
                    yield queries.users.convertToFullAccount(db, logger, [
                        ctx.state.userId,
                        email,
                        password,
                    ]);

                    ctx.status = 200;
                }
            }),
        },
    ],
};
