const a = require("../../utils/asyncify");
const createRouter = require("../../express/create-router");
const queries = require("../../db/queries");

module.exports = function createQuantityTypesRouter ({
    db,
    logger,
}) {
    logger = logger.child({
        router_creator: "quantity_types",
    });

    return createRouter(r => {
        r.get("/", a(function* (req, res, next) {
            res.json({
                quantity_types: yield queries.getQuantityTypes(db, logger),
            });
        }));
    });
};
