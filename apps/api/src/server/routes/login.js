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

            handler: a(function* (db, jwtService, logger, ctx, next) {
                const email    = ctx.request.body.email;
                const password = ctx.request.body.password;


                const userId = yield queries.users.checkByEmail(db, logger, [
                    email,
                    password,
                ]);

                if (userId) {
                    ctx.body = {
                        token: jwtService.encode(userId),
                    };
                } else {
                    ctx.status = 403;
                }
            }),
        },

        {
            method: "POST",
            path: "/by-device-identifier",

            handler: a(function* (db, jwtService, logger, ctx, next) {
                const deviceid  = ctx.request.body.deviceid;

                const userId = yield queries.users.checkByDeviceIdentifier(db, logger, [
                    deviceid,
                ]);

                if (userId) {
                    ctx.body = {
                        token: jwtService.encode({
                            userId,
                        }),
                    };
                } else {
                    ctx.status = 403;
                }
            }),
        },
    ],
};
