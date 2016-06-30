const a = require("../../utils/asyncify");
const createRouter = require("../../express/create-router");
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
        r.post("/", jsonBodyParser, a(function* (req, res) {
            const email    = req.body.email;
            const password = req.body.password;

            const validLogin = yield queries.users.check(db, logger, [
                email,
                password,
            ]);

            if (validLogin) {
                res.json({
                    token: jwtService.encode(email),
                });
            } else {
                res.sendStatus(403);
            }
        }));
    });
};
