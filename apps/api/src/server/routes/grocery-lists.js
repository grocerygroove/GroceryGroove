const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
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

        r.get("/", a(function* (ctx, next) {
            const email = ctx.state.token.email;

            ctx.body = {
                grocery_lists: yield queries.groceryLists.getAllByEmail(db, logger, [
                    email
                ]),
            };
        }));

        r.get("/:id", a(function* (ctx, next) {
            const email = ctx.state.token.email;
            const grocery_list_id = ctx.params.id;

            ctx.body = {
                grocery_list: yield queries.groceryLists.getOne(db, logger, [
                    email,
                    grocery_list_id
                ]),
            };
        }));

        r.post("/", jsonBodyParser, a(function* (ctx, next) {
            const email = ctx.state.token.email;
            const name = ctx.request.body.name;

            const groceryListId = yield queries.groceryLists.create(db, logger, [
                email,
                name,
            ]);

            ctx.body = {
                grocery_list_id: groceryListId,
            };

            void(queries.groceryLists.touchAccessLog(db, logger, [
                groceryListId,
            ]));
        }));
    });
};
