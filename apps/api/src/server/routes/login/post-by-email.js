const a = require("../../../utils/asyncify");
const queries = require("../../../db/queries");

module.exports = a(function* (db, jwtService, logger, ctx, next) {
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
});
