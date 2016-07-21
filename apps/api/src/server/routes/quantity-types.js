const a = require("../../utils/asyncify");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");

module.exports = {
    path: "/quantity-types",

    middlewares: [
        "jwtAuth",
        "householdExtractor",
        "userExtractor",
    ],

    routes: [
        {
            method: "GET",
            path: "/",

            deps: [
                "db",
                "logger",
            ],

            handler: a(function* (db, logger, ctx, next) {
                const userId = ctx.state.userId;

                ctx.body = {
                    quantity_types: yield queries.quantityTypes.getAll(db, logger, [
                        userId,
                    ]),
                };
            }),
        },
        {
            method: "POST",
            path: "/",

            deps: [
                "db",
                "logger",
            ],

            handler: a(function* (db, logger, ctx, next) {
                const householdId = ctx.state.householdId;
                const singularName = ctx.request.body.singularName;
                const pluralName = ctx.request.body.pluralName;
                const singularAbbreviation = ctx.request.body.singularAbbreviation;
                const pluralAbbreviation = ctx.request.body.pluralAbbreviation;

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
