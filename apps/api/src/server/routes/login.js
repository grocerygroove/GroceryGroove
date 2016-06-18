const createLoginRouter = function (radford, jwtsecret) {
    const router = require("../route-templates/nonauthenticated-route")(radford); 

    router.post("/", (req, res, next) => {
        const email = req.body.email;
        const pass = req.body.password;

        return radford.require([ "db" ])
        .then(({ db }) => {
            return db.using(client => client.queries.validateuser(email, password))
            .then(rows => {
                if(queryResults && queryResults[0] == 1) {//We have a vaild user
                    //Return a JWT token
                    const expires = moment().add('days', 7).valueOf();
                    const token = jwt.encode({
                        iss: email,
                        exp: expires
                    }, jwtsecret); 

                    res.json({
                        token : token,
                        expires: expires,
                        email: email
                    });
                } else {
                    //If we make it here, we didn't validate the user
                    res.json({
                        error: 'Invalid Username or Password'
                    });
                }
            })
            ;
        })
        .catch(next)
        ;
    });

    return router;
};

module.exports = createLoginRouter;
