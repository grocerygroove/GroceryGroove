const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");

module.exports = {
    path: "/categories",

    middlewares: [
        "authJwt",
        "extractHouseholdId",
        "extractUserId",
    ],

    services: [
        "db",
        "logger",
    ],

    routes: [
        {
            method: "get",

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                ctx.body = {
                    "category_names": yield queries.categories.getAllNames(db, logger, [
                        ctx.state.householdId,
                    ]),
                };
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
                const { db, logger } = ctx.services;

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
                const { db, logger } = ctx.services;

                ctx.body = {
                    categories: yield queries.categories.getAll(db, logger, [
                        ctx.state.householdId,
                    ]),
                };
            }),
        },
    ],
};
