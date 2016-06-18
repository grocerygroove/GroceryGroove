const createHouseholdRouter = function (radford, jwtsecret) {
    const router = require("../route-templates/authenticated-route")(radford, jwtsecret);    
    router.post("/", (req, res) => {
    });

    return router;
};

module.exports = createHouseholdRouter;
