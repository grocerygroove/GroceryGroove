const createRouter = require("express").Router;

const authenticatedRoute = (radford, jwtsecret) =>{
    const jwtauth = require("../../authentication/createjwtauth.js")(jwtsecret);
    const router = createRouter();

    router.use(jwtauth);

    return router;
};

module.exports = authenticatedRoute;
