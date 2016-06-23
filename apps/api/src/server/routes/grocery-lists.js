const createRouter = require("../../express/create-router");
const inPromise = require("../../util/in-promise");

const createGroceryListsRouter = function ({
    db,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "grocery-lists",
    });

    const router = createRouter();

    router.get("/", jwtAuthMw, (req, res) => {        
        const email = req.token.email;

        //The token's email and the requested email match up. Lets get and return the info
        return db.using(client => client.queries.getGroceryLists(email))
        .then(results => {
            // do something here? getuser returns householdid?
            if(results){
                res.json(results);
            }
            else {
                res.end('Invalid Request', 400);//
            }
        })
        ;      
    });

    router.post("/", jwtAuthMw, (req, res) => {
        const email = req.token.email;
        const { name } = req.body;
        return db.using(client => client.queries.createGroceryList(email, name))
        .then(results => {
            if(results){
                res.json(results);
            }
            else {
                res.end('Invalid Request', 400);//
            }
        })
        ;
        
    });
    return router;
};

module.exports = createGroceryListsRouter;
