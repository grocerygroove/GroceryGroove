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
            const userid = ctx.state.token.userid;
            ctx.body = {
                quantity_types: yield queries.quantityTypes.getAll(db, logger, [ userid ]),
            };
        }));
    });
};
