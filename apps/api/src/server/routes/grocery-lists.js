const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");
const DuplicateNameError = require("../../errors/duplicate-name-error");

module.exports = function createGroceryListsRouter ({
    db,
    householdExtractorMw,
    jsonBodyParserMw,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "grocery-lists",
    });

    return createRouter(r => {
        r.use(jwtAuthMw);
        r.use(householdExtractorMw);

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

        r.post("/", jsonBodyParserMw, a(function* (ctx, next) {
            const userid = ctx.state.token.userid;
            const name = ctx.request.body.name;
            const householdId = ctx.state.household_id;

            try {
                const groceryListId = yield queries.groceryLists.create(db, logger, [
                    userid,
                    name,
                    householdId,
                ]);

                if(!groceryListId){
                    ctx.throw(401, "User doesn't have access to this household");
                    return;
                }


                ctx.body = {
                    grocery_list_id: groceryListId,
                };


                void(queries.groceryLists.touchAccessLog(db, logger, [
                    groceryListId,
                ]));

            } catch (e) {
                if (e instanceof DuplicateNameError) {
                    ctx.throw(400, "Grocery list name must be unique");
                } else {
                    throw e;
                }
            }
        }));
    });
};
