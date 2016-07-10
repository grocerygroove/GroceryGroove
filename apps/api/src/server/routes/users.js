const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createUsersRouter ({
    db,
    jsonBodyParserMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "users",
    });

    return createRouter(r => {
        r.post("/email", jsonBodyParserMw, a(function* (ctx, next) {
            const email    = ctx.request.body.email;
            const password = ctx.request.body.password;

            yield queries.users.createUserAndHouseholdByEmail(db, logger, [
                email,
                password,
            ]);

            ctx.status = 200;
        }));

        r.post("/deviceid", jsonBodyParserMw, a(function* (ctx, next) {
            const deviceid    = ctx.request.body.deviceid;

            yield queries.users.createUserAndHouseholdByDeviceIdentifier(db, logger, [
                deviceid,
            ]);

            ctx.status = 200;
        }));
    });
};
