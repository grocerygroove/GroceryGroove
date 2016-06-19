const createRouter = require("../../express/create-router");
const inPromise = require("../../util/in-promise");

const createUsersRouter = function ({
    db,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "users",
    });

    const router = createRouter();


    //return household info about a user (if they are validated to have access)
    router.get('/:email', jwtAuthMw, (req, res) => {
        const email = req.token.email;

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

    router.post("/", (req, res) => {
        return inPromise(() => {
            const { email, password } = req.body;
            return db.using(client => {
                return client.queries.createUserAndHousehold(email, password);
            });
        })
        .then(() => res.sendStatus(200))
        .catch(error => {
            logger.info(error);
        });
    });

    return router;
};

module.exports = createUsersRouter;
