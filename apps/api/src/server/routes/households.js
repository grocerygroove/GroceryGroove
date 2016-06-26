const createRouter = require("../../express/create-router");

module.exports = function createHouseholdsRouter ({
    db,
    jwtAuthMw,
    logger,
}) {
    logger = logger.child({
        router_creator: "households",
    });

    const router = createRouter();

    router.use(jwtAuthMw);

    router.post("/", (req, res) => {
        //Do something....
    });

    return router;

};
