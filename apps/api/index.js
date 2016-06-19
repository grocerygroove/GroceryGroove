require('dotenv').load();
global.Promise = require("bluebird");

const bunyan = require("bunyan");
const createJwtAuthMw = require("./src/express/create-jwt-auth-mw");
const createJwtService = require("./src/http/jwt/create-service");
const createServerCallback = require("./src/server/create-callback");
const makeDatabase = require("./src/db/make-database");
const openPort = require("./src/http/open-port");

const logger = bunyan.createLogger({
    name: "api",
    src: true,
});

const db = makeDatabase(logger, process.env.DBCONNSTRING);
const jwt = createJwtService(process.env.JWTSECRET);

const jwtAuthMw = createJwtAuthMw(jwt, logger);

const serverCallback = createServerCallback({
    db,
    jwt,
    jwtAuthMw,
    logger,
});

openPort(8080, serverCallback)
.then(httpServer => {
    logger.info("Server started on http://localhost:8080");
})
.catch(e => {
    logger.error(e, "startup error");
});
