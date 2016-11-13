const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");
const cacheKeys = {
    getGroceryListsKey: (householdId) => {
        return `getGroceryListsHoushold${householdId}`;
    },
    getSingleGroceryListKey: (householdId, groceryListId) => {
        return `getSingleGroceryList${groceryListId}Houshold${householdId}`;
    },
};

module.exports = {
    path: "/grocery-lists",

    middlewares: [
        "authJwt",
        "extractHouseholdId",
        "extractUserId",
    ],

    services: [
        "cacher",
        "db",
        "logger",
        "messenger",
    ],

    routes: [
        {
            method: "get",
            path: "/",

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const { cacher, db, logger } = ctx.services;
                let response;
                const cacheKey = cacheKeys.getGroceryListsKey(ctx.state.householdId);
                const cachedResult = yield cacher.get(cacheKey);
                if (cachedResult) {
                    response = cachedResult;
                } else {
                    //Go get fetch the grocery lists and cache them
                    response = {
                        "grocery_lists": yield queries.groceryLists.getAll(db, logger, {
                            householdId: ctx.state.householdId,
                            userId: ctx.state.userId,
                        }),
                    };
                    yield cacher.set(cacheKey, response);
                }

                ctx.body = response;
            }),
        },

        {
            method: "get",
            path: "/:id",

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    type: "integer",
                },
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: a(function* (ctx, next) {
                const { cacher, db, logger } = ctx.services;

                if (!ctx.id || !ctx.id.match(/^\d+$/)) {
                    ctx.throw(400, "Invalid or missing Grocery List id");
                } else {
                    let response;
                    const cacheKey = cacheKeys.getSingleGroceryListKey(ctx.state.householdId, ctx.id);
                    const cachedResult = yield cacher.get(cacheKey);
                    if (cachedResult) {
                        response = cachedResult;
                    } else {
                        response = {
                            "grocery_list": yield queries.groceryLists.getOne(db, logger, {
                                householdId: ctx.state.householdId,
                                userId: ctx.state.userId,
                                groceryListId: ctx.id,
                            }),
                        };
                        yield cacher.set(cacheKey, response);
                    }
                    ctx.body = response;
                }
            }),
        },

        {
            method: "post",
            path: "/",

            middlewares: [
                "parseJsonBody",
            ],

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "name",
                    in: "body",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
                401: {},
            },

            handler: a(function* (ctx, next) {
                const { cacher, db, logger, messenger } = ctx.services;

                const userId = ctx.state.userId;
                const householdId = ctx.state.householdId;
                const name = ctx.request.body.name;

                try {
                    const groceryListId = yield queries.groceryLists.addOne(db, logger, {
                        userId,
                        groceryListName: name,
                        householdId,
                    });

                    if (!groceryListId) {
                        ctx.throw(401, "User doesn't have access to this household");
                        return;
                    }

                    //Invalidate cache
                    yield cacher.del(cacheKeys.getGroceryListsKey(householdId));
                    //Send message
                    messenger.addMessage(`household:'${householdId}' new grocery list`);

                    ctx.body = {
                        "grocery_list_id": groceryListId,
                    };

                    void(queries.groceryLists.touchAccessLog(db, logger, {
                        groceryListId,
                    }));

                } catch (e) {
                    if (e instanceof DuplicateNameError) {
                        ctx.throw(400, "Grocery list name must be unique");
                    } else {
                        throw e;
                    }
                }
            }),
        },

        {
            method: "post",
            path: "/:id/item",

            middlewares: [
                "parseJsonBody",
            ],

            produces: [
                "application/json",
            ],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    type: "integer",
                },
                {
                    name: "item_id",
                    in: "body",
                    required: true,
                    type: "integer",
                },
                {
                    name: "quantity_type_id",
                    in: "body",
                    required: true,
                    type: "integer",
                },
                {
                    name: "quantity",
                    in: "body",
                    required: true,
                    type: "number",
                    format: "double",
                },
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                const userId = ctx.state.userId;
                const itemId = ctx.request.body.item_id;
                const quantityTypeId = ctx.request.body.quantity_type_id;
                const quantity = ctx.request.body.quantity;

                if (!ctx.id || !ctx.id.match(/^\d+$/)) {
                    ctx.throw(400, "Invalid or missing Grocery List id");
                } else if (!itemId || !itemId.match(/^\d+$/)) {
                    ctx.throw(400, "Invalid or missing 'item_id'");
                } else if (!quantityTypeId || !quantityTypeId.match(/^\d+$/)) {
                    ctx.throw(400, "Invalid or missing 'quantity_type_id'");
                } else if (!quantity || !quantity.match(/^[+-]?\d+(\.\d+)?$/)) {
                    ctx.throw(400, "Invalid or missing 'quantity'");
                } else {
                    ctx.body = {
                        "grocery_list_item_id": yield queries.groceryLists.items.addOne(db, logger, {
                            groceryListId: ctx.id,
                            userId: ctx.state.userId,
                            itemId,
                            quantityTypeId,
                            quantity,
                        }),
                    };

                    void(queries.groceryLists.touchAccessLog(db, logger, {
                        groceryListId: ctx.id,
                    }));
                }

            }),
        },
    ],
};
