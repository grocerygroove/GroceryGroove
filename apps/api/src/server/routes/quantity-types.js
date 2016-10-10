const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");

module.exports = {
    path: "/quantity-types",

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
            path: "/",

            produces: [
                "application/json",
            ],

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                const userId = ctx.state.userId;

                ctx.body = {
                    "quantity_types": yield queries.quantityTypes.getAll(db, logger, [
                        userId,
                    ]),
                };
            }),
        },
        {
            method: "post",
            path: "/",

            deps: [
                "db",
                "logger",
            ],

            parameters: [
                {
                    name: "singular_name",
                    in: "body",
                    required: true,
                    type: "string",
                },
                {
                    name: "plural_name",
                    in: "body",
                    required: false,
                    type: "string",
                },
                {
                    name: "singular_abbreviation",
                    in: "body",
                    required: false,
                    type: "string",
                },
                {
                    name: "plural_abbreviation",
                    in: "body",
                    required: false,
                    type: "string",
                },
            ],

            responses: {
                200: {},
                400: {},
            },

            handler: a(function* (ctx, next) {
                const { db, logger } = ctx.services;

                const householdId = ctx.state.householdId;
                const singularName = ctx.request.body.singular_name;
                const pluralName = ctx.request.body.plural_name;
                const singularAbbreviation = ctx.request.body.singular_abbreviation;
                const pluralAbbreviation = ctx.request.body.plural_abbreviation;

                if (!singularName) {
                    ctx.throw(400, "Must at least supply a singular name");
                } else {
                    try {
                        yield queries.quantityTypes.addOne(db, logger, [
                            householdId,
                            singularName,
                            pluralName,
                            singularAbbreviation,
                            pluralAbbreviation,
                        ]);

                        ctx.status = 200;
                    } catch (e) {
                        if (e instanceof DuplicateNameError) {
                            ctx.throw(400, "Quantity type names must be unique with a household");
                        } else {
                            throw e;
                        }
                    }
                }
            }),
        },
    ],
};
