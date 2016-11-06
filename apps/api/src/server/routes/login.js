const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/login",

    middlewares: [
        "parseJsonBody",
    ],

    services: [
        "db",
        "jwt",
        "logger",
    ],

    routes: [
        {
            method: "post",
            path: "/by-email",

            produces: [
                "application/json",
            ],

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
                403: {},
            },

            handler: a(function* (ctx, next) {
                const { db, jwt, logger } = ctx.services;

                const email = ctx.request.body.email;
                const password = ctx.request.body.password;


                const userId = yield queries.users.checkByEmail(db, logger, [
                    email,
                    password,
                ]);

                if (userId) {
                    ctx.body = {
                        token: jwt.encode({
                            "user_id": userId,
                        }),
                    };
                } else {
                    ctx.status = 403;
                    ctx.body = {
                        message: "Invalid username or password",
                    };
                }
            }),
        },

        {
            method: "post",
            path: "/by-device-identifier",

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "device_identifier",
                    in: "body",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                403: {},
            },

            handler: a(function* (ctx, next) {
                const { db, jwt, logger } = ctx.services;

                const deviceIdentifier = ctx.request.body.device_identifier;

                const userId = yield queries.users.checkByDeviceIdentifier(db, logger, [
                    deviceIdentifier,
                ]);

                if (userId) {
                    ctx.body = {
                        token: jwt.encode({
                            "user_id": userId,
                        }),
                    };
                } else {
                    ctx.status = 403;
                }
            }),
        },
    ],
};
