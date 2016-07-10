const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createLoginRouter ({
    db,
    jwtService,
    jsonBodyParserMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "login",
    });

    return createRouter(r => {
        r.use(jsonBodyParserMw);

        r.post("/by-email", a(function* (ctx, next) {
            const email    = ctx.request.body.email;
            const password = ctx.request.body.password;

            const userId = yield queries.users.checkByEmail(db, logger, [
                email,
                password,
            ]);

            if (userId) {
                ctx.body = {
                    token: jwtService.encode({
                        userId,
                    });
                };
            } else {
                ctx.status = 403;
            }
        }));

        r.post("/by-device-identifier", a(function* (ctx, next) {
            const deviceid  = ctx.request.body.deviceid;

            const userId = yield queries.users.checkByDeviceIdentifier(db, logger, [
                deviceid,
            ]);

            if (userId) {
                ctx.body = {
                    token: jwtService.encode({
                        userId,
                    });
                };
            } else {
                ctx.status = 403;
            }
        }));
    });
};
