const a = require("../../utils/asyncify");
const createRouter = require("../../express/create-router");
const queries = require("../../db/queries");

module.exports = function createGroceryListsRouter ({
    db,
    jwtAuthMw,
    jsonBodyParser,
    logger,
}) {
    logger = logger.child({
        router_creator: "grocery-lists",
    });

    return createRouter(r => {
        r.use(jwtAuthMw);

        r.get("/", a(function* (req, res) {
            const email = req.token.email;

            res.json({
                grocery_lists: yield queries.getGroceryList(db, logger, [
                    email
                ]),
            });
        }));

        r.get("/:id", a(function* (req, res) {
            const email = req.token.email;
            const grocery_list_id = req.params.id;

            res.json(yield queries.getGroceryList(db, logger, [
                email,
                grocery_list_id
            ]));
        }));

        r.post("/", jsonBodyParser, a(function* (req, res) {
            const email = req.token.email;
            const name = req.body.name;

            const groceryListId = yield queries.createGroceryList(db, logger, [
                email,
                name,
            ]);

            res.json({
                grocery_list_id: groceryListId,
            });

            yield queries.touchGroceryListAccessLog(db, logger, [
                groceryListId,
            ]);
        }));
    });
};
