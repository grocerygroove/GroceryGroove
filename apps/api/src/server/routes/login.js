const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/login",

    middlewares: [
        "jsonBodyParser",
    ],

    deps: [
        "db",
        "jwtService",
        "logger",
    ],

    routes: [
        {
            method: "POST",
            path: "/by-email",

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "email",
                    in: "body",
                    required: "true",
                    type: "string",
                },
                {
                    name: "password",
                    in: "body",
                    required: "true",
                    type: "string",
                },
            ],

            responses: {
                200: {},
                403: {},
            },

            handler: a(function* (db, jwtService, logger, ctx, next) {
                const email = ctx.request.body.email;
                const password = ctx.request.body.password;


                const userId = yield queries.users.checkByEmail(db, logger, [
                    email,
                    password,
                ]);

                if (userId) {
                    ctx.body = {
                        token: jwtService.encode({
                            "user_id": userId,
                        }),
                    };
                } else {
                    ctx.status = 403;
                }
            }),
        },

        {
            method: "POST",
            path: "/by-device-identifier",

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "device_identifier",
                    in: "body",
                    required: "true",
                    type: "string",
                },
            ],

            responses: {
                200: {},
                403: {},
            },

            handler: a(function* (db, jwtService, logger, ctx, next) {
                const deviceIdentifier = ctx.request.body.device_identifier;

                const userId = yield queries.users.checkByDeviceIdentifier(db, logger, [
                    deviceIdentifier,
                ]);

                if (userId) {
                    ctx.body = {
                        token: jwtService.encode({
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
