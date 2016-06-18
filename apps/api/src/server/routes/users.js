const createRouter = require("../../express/create-router");

const createUsersRouter = function ({
    db,
    jwtAuthMw,
    jwtIdentifierExtractor,
    logger,
}) {
    logger = logger.child({
        router_creator: "users",
    });

    const router = createRouter();

    router.use(jwtAuthMw);

    //return household info about a user (if they are validated to have access)
    router.get('/:email', (req, res) => {
        const email = jwtIdentifierExtractor(req.token);
        
        if(email !== req.params.email) {
            res.end('Insufficient Access', 401);
        }

        //The token's email and the requested email match up. Lets get and return the info
        return db.using(client => client.queries.getuser(email))
        .then(householdId => {
            // do something here? getuser returns householdid?
            if(queryResults){
                res.json(queryResults);
            }
            else {
                res.end('Invalid Request', 400);//
            }
        })
        ;
    });

    return router;
};

module.exports = createUsersRouter;
