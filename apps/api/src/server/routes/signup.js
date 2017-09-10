const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");
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

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                const email = ctx.request.body.email;
                const password = ctx.request.body.password;

                try {
                    yield transactions.users.createUserAndHouseholdByEmail(db, logger, [
                        email,
                        password,
                    ]);

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
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                const deviceIdentifier = ctx.request.body.device_identifier;

                try {
                    yield queries.users.createUserAndHouseholdByDeviceIdentifier(db, logger, [
                        deviceIdentifier,
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
