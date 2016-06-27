const a = require("../../util/asyncify");
const createRouter = require("../../express/create-router");
const queries = require("../../db/queries");

module.exports = function createLoginRouter ({
    db,
    jwt,
    logger,
}) {
    logger = logger.child({
        router_creator: "login",
    });

    return createRoute(r => {
        router.post("/", jsonBodyParser, a(function* (req, res) {
            const email    = req.body.email;
            const password = req.body.password;

            const validLogin = yield queries.checkLogin(db, [
                email,
                password,
            ]);

            if (validLogin) {
                res.json({
                    token: jwt.encode(email),
                });
            } else {
                res.sendStatus(403);
            }
        }));
    });
};
