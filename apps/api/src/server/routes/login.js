const createRouter = require("../../express/create-router");

const createLoginRouter = function({
    db,
    jwt,
    jwtAuthMw,
    logger,
}) {
    const router = createRouter();

    router.post("/", (req, res, next) => {
        const email = req.body.email;
        const pass = req.body.password;

        return db.using(client => client.queries.validateuser(email, password))
        .then(rows => {
            if(queryResults && queryResults[0] == 1) {//We have a vaild user
                //Return a JWT token
                const token = jwt.encode(email);

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
    });

    return router;
};

module.exports = createLoginRouter;


