const a = require("../../util/asyncify");
const createRouter = require("../../express/create-router");
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
        r.post("/", jsonBodyParser, a(function* (req, res) {
            const email    = req.body.email;
            const password = req.body.password;

            yield queries.createUserAndHousehold(db, logger, [
                email,
                password,
            ]);

            res.sendStatus(200);
        }));
    });
};
