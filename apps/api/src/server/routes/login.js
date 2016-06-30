const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createLoginRouter ({
    db,
    jwtService,
    jsonBodyParser,
    logger,
}) {
    logger = logger.child({
        router_creator: "login",
    });

    return createRouter(r => {
        r.post("/", jsonBodyParser, a(function* (ctx, next) {
            const email    = ctx.request.body.email;
            const password = ctx.request.body.password;

            const validLogin = yield queries.users.check(db, logger, [
                email,
                password,
            ]);

            if (validLogin) {
                ctx.body = {
                    token: jwtService.encode(email),
                };
            } else {
                ctx.status = 403;
            }
        }));
    });
};
