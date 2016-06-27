const a = require("../../util/asyncify");
const createRouter = require("../../express/create-router");
const queries = require("../../db/queries");

module.exports = function createCategoriesRouter ({
    db,
    logger,
}) {
    logger = logger.child({
        router_creator: "categories",
    });

    return createRouter(r => {
        r.get("/", a(function* (req, res) {
            res.json({
                category_names: yield queries.getCategoryNames(db),
            });
        }));
    });
};
