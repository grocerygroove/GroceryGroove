const a = require("../../utils/asyncify");
const createRouter = require("../../http/create-router");
const queries = require("../../db/queries");

module.exports = function createCategoriesRouter ({
    db,
    householdExtractorMw,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "categories",
    });

    return createRouter(r => {
        r.use(jwtAuthMw);
        r.use(householdExtractorMw);

        r.get("/", a(function* (ctx, next) {
            ctx.body = {
                category_names: yield queries.categories.getAllNames(db, logger),
            };
        }));
    });
};
