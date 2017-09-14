const DuplicateNameError = require("../../errors/duplicate-name-error");
const transactions = require("../../db/transactions");

module.exports = {
    path: "/signup",

    middlewares: [
        "parseJsonBody",
    ],

    services: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "post",
            path: "/by-email",

            parameters: [
                {
                    name: "email",
                    in: "body",
                    required: true,
                    type: "string",
                },
                {
                    name: "nickname",
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

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: (async function (ctx, next) {
                const { db, logger } = ctx.services;

                const email = ctx.request.body.email;
                const nickname = ctx.request.body.nickname;
                const password = ctx.request.body.password;

                try {
                    await transactions.users.createUserAndHouseholdByEmail(db, logger, {
                        email,
                        nickname,
                        password,
                    });

                    ctx.status = 200;
                    ctx.body = {
                        message: "Account creation successful",
                    };
                } catch (e) {
                    if (e instanceof DuplicateNameError) {
                        ctx.status = 400;
                        ctx.body = {
                            issueParameter: "email",
                            message: "Email address already exists",
                        };
                    } else {
                        throw e;
                    }
                }
            }),
        },

        {
            method: "post",
            path: "/by-device-identifier",

            parameters: [
                {
                    name: "device_identifier",
                    in: "body",
                    required: true,
                    type: "string",
                },
                {
                    name: "nickname",
                    in: "body",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: (async function (ctx, next) {
                const { db, logger } = ctx.services;

                const deviceIdentifier = ctx.request.body.device_identifier;
                const nickname = ctx.request.body.nickname;

                try {
                    await transactions.users.createUserAndHouseholdByDeviceIdentifier(db, logger, [
                        deviceIdentifier,
                        nickname,
                    ]);
                    ctx.status = 200;
                } catch (e) {
                     if (e instanceof DuplicateNameError) {
                        ctx.throw(400, "Device Identifier must be unique");
                    } else {
                        throw e;
                    }
                }
            }),
        },
    ],
};
