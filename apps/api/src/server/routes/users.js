const a = require("../../utils/asyncify");
const queries = require("../../db/queries");

module.exports = {
    path: "/users",

    middlewares: [
        "jsonBodyParser",
        "userExtractor",
    ],

    deps: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "PUT",
            path: "/upgrade",

            handler: a(function* (db, logger, ctx, next) {
                const email = ctx.request.body.email;
                const password = ctx.request.body.password;

                if (!email || !password) {
                    ctx.throw(400, "Must pass email and password");
                } else {
                    yield queries.users.convertToFullAccount(db, logger, [
                        ctx.state.userId,
                        email,
                        password,
                    ]);

                    ctx.status = 200;
                }
            }),
        },
    ],
};
