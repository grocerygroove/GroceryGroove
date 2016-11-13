const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");
const cacheKeys = {
    getCategoriesKey: (householdId) => {
        return `getCategoriesHoushold${householdId}`;
    },
    getCategoriesInfoKey: (householdId) => {
        return `getCategoriesInfoHoushold${householdId}`;
    },
};

module.exports = {
    path: "/categories",

    middlewares: [
        "authJwt",
        "parseJsonBody",
        "extractHouseholdId",
        "extractUserId",
    ],

    services: [
        "db",
        "logger",
        "messenger",
        "cacher",
    ],

    routes: [
        {
            method: "get",

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger, cacher } = ctx.services;
                let response;
                const cacheKey = cacheKeys.getCategoriesKey(ctx.state.householdId);
                const cachedResult = yield cacher.get(cacheKey);
                if (cachedResult) {
                    response = cachedResult;
                } else {
                    //Go fetch the categories and cache them
                    response = {
                        "category_names": yield queries.categories.getAllNames(db, logger, {
                            householdId: ctx.state.householdId,
                        }),
                    };
                    yield cacher.set(cacheKey, response);
                }
                ctx.body = response;
            }),
        },

        {
            method: "post",

            parameters: [
                {
                    name: "name",
                    in: "body",
                    description: "Category Name",
                    required: true,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger, messenger, cacher } = ctx.services;

                const categoryName = ctx.request.body.name;

                if (!categoryName) {
                    ctx.throw(400, "Must include a category name");
                } else {
                    try {
                        yield queries.categories.addOne(db, logger, {
                            householdId: ctx.state.householdId,
                            createdById: ctx.state.userId,
                            name:        categoryName,
                        });

                        //Invalidate cache
                        yield cacher.delMulti([
                            cacheKeys.getCategoriesKey(ctx.state.householdId),
                            cacheKeys.getCategoriesInfoKey(ctx.state.householdId),
                        ]);
                        //Send message out alerting new data
                        yield messenger.addMessage(`household:'${ctx.state.householdId}' new category`);
                        ctx.status = 200;
                    } catch (e) {
                        if (e instanceof DuplicateNameError) {
                            ctx.throw(400, "Category Name must be unique within a household");
                        } else {
                            throw e;
                        }
                    }
                }
            }),
        },

        {
            method: "get",
            path: "/info",

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger, cacher } = ctx.services;

                const cacheKey = cacheKeys.getCategoriesInfoKey(ctx.state.householdId);
                const cachedResult = yield cacher.get(cacheKey);
                if (cachedResult) {
                    response = cachedResult;
                } else {
                    //Go fetch the categories and cache them
                    response = {
                        categories: yield queries.categories.getAll(db, logger, {
                            householdId: ctx.state.householdId,
                        }),
                    };
                    yield cacher.set(cacheKey, response);
                }
                ctx.body = response;
            }),
        },
    ],
};
