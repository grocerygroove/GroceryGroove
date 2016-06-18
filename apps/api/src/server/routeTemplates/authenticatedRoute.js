const createRouter = require("express").Router;

const authenticatedRoute = (radford, jwtsecret) =>{
    const jwtauth = require("../../authentication/jwtauth.js")(jwtsecret);
    const router = createRouter();

    router.use(jwtauth);

    return router;
};

module.exports = authenticatedRoute;
