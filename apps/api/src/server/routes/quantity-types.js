const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createQuantityTypesRouter ({
    db,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "quantity_types",
    });

    return createRouter(r => {
        r.use(jwtAuthMw);
        r.get("/", a(function* (ctx, next) {
            const email = ctx.state.token.email;
            ctx.body = {
                quantity_types: yield queries.quantityTypes.getAll(db, logger, [ email ]),
            };
        }));
    });
};
