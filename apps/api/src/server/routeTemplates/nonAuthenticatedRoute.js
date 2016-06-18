const createRouter = require("express").Router;

const nonAuthenticatedRoute = (radford) =>{    
    const router = createRouter();    

    return router;
};

module.exports = nonAuthenticatedRoute;
