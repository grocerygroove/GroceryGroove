const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");

module.exports = {
    path: "/grocery-lists",

    middlewares: [
        "jwtAuth",
        "householdExtractor",
        "userExtractor",
    ],

    deps: [
        "db",
        "logger",
    ],


    routes: [
        {
            method: "GET",
            path: "/",

            handler: a(function* (db, logger, ctx, next) {

                ctx.body = {
                    groceryLists: yield queries.groceryLists.getAll(db, logger, [
                        ctx.state.householdId,
                        ctx.state.userId,
                    ]),
                };
            }),
        },

        {
            method: "GET",
            path: "/:id",

            handler: a(function* (db, logger, ctx, next) {
                if (!ctx.id || !ctx.id.match(/^\d+$/)) {
                    ctx.throw(400, "Invalid or missing Grocery List id");
                } else {
                    ctx.body = {
                        groceryList: yield queries.groceryLists.getOne(db, logger, [
                            ctx.state.householdId,
                            ctx.state.userId,
                            ctx.id,
                        ]),
                    };
                }
            }),
        },

        {
            method: "POST",
            path: "/",

            middlewares: [
                "jsonBodyParser",
            ],

            handler: a(function* (db, logger, ctx, next) {
                const userId = ctx.state.userId;
                const householdId = ctx.state.householdId;
                const name = ctx.request.body.name;

                try {
                    const groceryListId = yield queries.groceryLists.addOne(db, logger, [
                        userId,
                        name,
                        householdId,
                    ]);

                    if (!groceryListId) {
                        ctx.throw(401, "User doesn't have access to this household");
                        return;
                    }

                    ctx.body = {
                        groceryListId,
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
            }),
        },
    ],
};
