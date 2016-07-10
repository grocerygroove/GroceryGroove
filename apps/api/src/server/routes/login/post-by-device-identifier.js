const a = require("../../../utils/asyncify");
const queries = require("../../../db/queries");

module.exports = a(function* (db, jwtService, logger, ctx, next) {
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
});
