const createRouter = require("../../express/create-router");

module.exports = function createCategoriesRouter ({
    db,
    logger,
}) {
    logger = logger.child({
        router_creator: "categories",
    });

    const router = createRouter();

    router.get("/", (req, res, next) => {
        return db.using(client => client.queries.getCategories())
        .then(results => {
            if(results){
                res.json(results);
            }
            else {
                res.end('No categories defined', 404);//
            }
        })
        ;
    });

    return router;
};
