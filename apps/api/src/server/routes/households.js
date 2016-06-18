const createHouseholdRouter = function (radford, jwtsecret) {
    const router = require("../routeTemplates/authenticatedRoute")(radford, jwtsecret);    
    router.post("/", (req, res) => {
    });

    return router;
};

module.exports = createHouseholdRouter;
