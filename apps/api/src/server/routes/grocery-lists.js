const a = require("../../util/asyncify");
const createRouter = require("../../express/create-router");
const queries = require("../../db/queries");

module.exports = function createGroceryListsRouter ({
    db,
    jwtAuthMw,
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
                grocery_lists: yield queries.getGroceryList(db, [
                    email
                ]),
            });
        }));

        r.post("/", a(function* (req, res) {
            const email = req.token.email;
            const name = req.body.name;


            const groceryListId = yield queries.createGroceryList(db, [
                email,
                name,
            ]);

            res.json({
                grocery_list_id: groceryListId,
            });

            yield queries.touchGroceryListAccessLog(db, [ groceryListId ]);
        }));
    });
};
