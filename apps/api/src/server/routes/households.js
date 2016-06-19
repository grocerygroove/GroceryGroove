const createRouter = require("../../express/create-router");

const createHouseholdsRouter = function ({
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

module.exports = createHouseholdsRouter;
