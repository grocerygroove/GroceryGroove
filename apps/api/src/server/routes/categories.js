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
            // This is bad, like really bad. When asking the server "give me a
            // list of the category names you have", if the server doesn't have
            // any categories then it shouldn't say "404(ERROR: NO CATEGORIES)".
            // It should say "200([])".
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
