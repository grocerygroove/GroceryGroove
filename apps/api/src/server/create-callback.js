const createHouseholdExtractor = require("../middleware/create-household-extractor");
const createJsonBodyParser = require("koa-json-body");
const createRouter = require("../http/create-router");
const Koa = require('koa');
const routes = {
    login: {
        postByEmail:            require("./routes/login/post-by-email"),
        postByDeviceIdentifier: require("./routes/login/post-by-device-identifier"),
    },
};

const createRoutes = function (cb) {
    return createRouter(cb).routes();
};

module.exports = function createCallback (services) {
    if (typeof services !== "object") {
        throw new Error("services must be map");
    }
    if (!services.logger) {
        throw new Error("missing logger");
    }
    if (!services.db) {
        throw new Error("missing db");
    }
    services = Object.assign(
        {
            householdExtractorMw: createHouseholdExtractor(services.logger),
            jsonBodyParserMw: createJsonBodyParser(),
        },
        services
    );

    const koaApp = new Koa();

    // I really don't like this. I need to fully investigate routing in koa
    // but for now this will work.
    koaApp.use(createRoutes(r => {
        r.use("/grocery-lists",  r => require("./routes/grocery-lists")  (services));
        r.use("/households",     r => require("./routes/households")     (services));
        r.use("/categories",     r => require("./routes/categories")     (services));
        r.use("/quantity-types", r => require("./routes/quantity-types") (services));

        r.use("/login", createRoutes(r => {
            r.use(services.jsonBodyParserMw);

            r.post("/by-email", (ctx, next) => routes.login.postByEmail(
                services.db,
                services.jwtService,
                services.logger.child({
                    route: "/login/by-email",
                }),
                ctx,
                next
            ));

            r.post("/by-device-identifer", (ctx, next) => routes.login.postByDeviceIdentifer(
                services.db,
                services.jwtService,
                services.logger.child({
                    route: "/login/by-device-identifier",
                }),
                ctx,
                next
            ));
        }));

        r.use("/signup",         r => require("./routes/signup")         (services));
    }));

    return koaApp.callback();
};
