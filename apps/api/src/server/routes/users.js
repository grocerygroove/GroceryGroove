const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createUsersRouter ({
    db,
    jsonBodyParser,
    logger,
}) {
    logger = logger.child({
        router_creator: "users",
    });

    return createRouter(r => {
        r.post("/email", jsonBodyParser, a(function* (ctx, next) {
            const email    = ctx.request.body.email;
            const password = ctx.request.body.password;

            yield queries.users.createUserAndHouseholdByEmail(db, logger, [
                userid,
                password,
            ]);

            ctx.status = 200;
        }));

        r.post("/deviceid", jsonBodyParser, a(function* (ctx, next) {
            const deviceid    = ctx.request.body.deviceid;

            yield queries.users.createUserAndHouseholdByDeviceIdentifier(db, logger, [
                deviceid,
            ]);

            ctx.status = 200;
        }));
    });
};
