const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createQuantityTypesRouter ({
    db,
    householdExtractorMw,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "quantity_types",
    });

    return createRouter(r => {
        r.use(jwtAuthMw);
        r.use(householdExtractorMw);

        r.get("/", a(function* (ctx, next) {
            const userId = ctx.state.token.userId;

            ctx.body = {
                quantity_types: yield queries.quantityTypes.getAll(db, logger, [
                    userId,
                ]),
            };
        }));
    });
};
