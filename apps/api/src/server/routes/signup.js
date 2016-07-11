const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
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

                try{
                    yield queries.users.createUserAndHouseholdByEmail(db, logger, [
                        email,
                        password,
                    ]);

                    ctx.status = 200;
                } catch (e) {
                    if (e instanceof DuplicateNameError) {
                        ctx.throw(400, "Email address must be unique");
                    } else {
                        throw e;
                    }
                }
            }),
        },

        {
            method: "POST",
            path: "/by-device-identifier",

            handler: a(function* (db, logger, ctx, next) {
                const deviceIdentifier = ctx.request.body.deviceIdentifier;

                try{
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
