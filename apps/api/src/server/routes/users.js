const a = require("../../util/asyncify");
const createRouter = require("../../express/create-router");
const queries = require("../../db/queries");

module.exports = function createUsersRouter ({
    db,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "users",
    });

    return createRouter(r => {
        r.post("/", a(function* (req, res) {
            const email    = req.body.email;
            const password = req.body.password;

            yield queries.createUserAndHousehold(db, [
                email,
                password,
            ]);

            res.sendStatus(200);
        }));
    });
};
