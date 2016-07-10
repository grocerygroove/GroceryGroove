const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/signup",

    middlewares: [
        "jsonBodyParser",
    ],

    deps: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "POST",
            path: "/by-email",

            handler: a(function* (db, logger, ctx, next) {
                const email    = ctx.request.body.email;
                const password = ctx.request.body.password;

                yield queries.users.createUserAndHouseholdByEmail(db, logger, [
                    email,
                    password,
                ]);

                ctx.status = 200;
            }),
        },

        {
            method: "POST",
            path: "/by-device-identifier",

            handler: a(function* (db, logger, ctx, next) {
                const deviceIdentifier = ctx.request.body.deviceIdentifier;

                yield queries.users.createUserAndHouseholdByDeviceIdentifier(db, logger, [
                    deviceid,
                ]);

                ctx.status = 200;
            }),
        },
    ],
};
