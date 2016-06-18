const createUsersRouter = function (radford, jwtsecret) {
    const router = require("../routeTemplates/authenticatedRoute")(radford, jwtsecret);    


    //return household info about a user (if they are validated to have access)
    router.get('/:email', (req, res) => {
        if(req.email !== req.params.email) {
            res.end('Insufficient Access', 401);
        }

        //The token's email and the requested email match up. Lets get and return the info
        return radford.require([ "db" ])
        .then(({ db }) => {
            return db.using(client => client.queries.getuser(req.email))
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
        })
        ;
    });

    return router;
};

module.exports = createUsersRouter;
