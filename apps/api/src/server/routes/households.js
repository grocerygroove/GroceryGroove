const createRouter = require("express").Router;
const jwtauth = require("../../jwtauth.js");

const createHouseholdRouter = function (radford) {
    const router = createRouter();

    router.use(jwtauth);
    router.post("/", (req, res) => {
    });

    return router;
};

module.exports = createHouseholdRouter;
