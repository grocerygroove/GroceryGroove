const createRouter = require("../../express/create-router");

module.exports = function createQuantityTypesRouter ({
    db,
    logger,
}) {
    logger = logger.child({
        router_creator: "quantity_types",
    });

    const router = createRouter();

    router.get("/", (req, res, next) => {
        return db.using(client => client.queries.getQuantityTypes())
        .then(results => {
            if(results){
                res.json(results);
            }
            else {
                res.end('No quantity types defined', 404);//
            }
        })
        ;
    });

    return router;
};
