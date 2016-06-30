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
        r.post("/", jsonBodyParser, a(function* (ctx, next) {
            const email    = ctx.request.body.email;
            const password = ctx.request.body.password;

            yield queries.users.createUserAndHousehold(db, logger, [
                email,
                password,
            ]);

            ctx.status = 200;
        }));
    });
};
