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
            const userid = ctx.state.token.userid;

            ctx.body = {
                grocery_lists: yield queries.groceryLists.getAllByEmail(db, logger, [
                    userid
                ]),
            };
        }));

        r.get("/:id", a(function* (ctx, next) {
            const userid = ctx.state.token.userid;
            const grocery_list_id = ctx.params.id;

            ctx.body = {
                grocery_list: yield queries.groceryLists.getOne(db, logger, [
                    userid,
                    grocery_list_id
                ]),
            };
        }));

        r.post("/", jsonBodyParser, a(function* (ctx, next) {
            const userid = ctx.state.token.userid;
            const name = ctx.request.body.name;
            const householdId = ctx.request.body.householdId;

            try{
                const groceryListId = yield queries.groceryLists.create(db, logger, [
                    userid,
                    name,
                    householdId,
                ]);


                console.log("Shouldn't have gotten here");
                ctx.body = {
                    grocery_list_id: groceryListId,
                };

                void(yield queries.groceryLists.touchAccessLog(db, logger, [
                    groceryListId,
                ]));
            } catch(e) {
                if(e.message === "User doesn't have permission to create grocery list for this household.") {
                    ctx.throw(403);
                } else if(e.message === "Grocery list name must be unique.") {
                    ctx.throw(400, e.message);
                } else {
                    throw e;
                }
            }
        }));
    });
};
