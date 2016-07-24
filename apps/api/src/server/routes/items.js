const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");

module.exports = {
    path: "/items",

    middlewares: [
        "jsonBodyParser",
        "householdExtractor",
        "userExtractor",
    ],

    deps: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "POST",
            path: "/",

            handler: a(function* (db, logger, ctx, next) {
                const itemName = ctx.request.body.name;
                const itemDescription = ctx.request.body.description;

                if (!itemName) {
                    ctx.throw(400, "Must include item name in request body");
                } else {
                    try {
                        ctx.body = {
                            itemId: yield queries.items.addOne(db, logger, [
                                ctx.state.householdId,
                                itemName,
                                itemDescription,
                            ]),
                        };
                    } catch (e) {
                        if (e instanceof DuplicateNameError) {
                            ctx.throw(400, "Item name must be unique");
                        } else {
                            throw e;
                        }
                    }
                }
            }),
        },
    ],
};
