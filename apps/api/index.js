require('dotenv').load();
global.Promise = require("bluebird");

const bunyan = require("bunyan");
const makeDatabase = require("./src/db/make-database");
const createServerCallback = require("./src/server/create-callback");
const openPort = require("./src/http/open-port");
const createJwtAuthMw = require("./src/authentication/create-jwt-auth-mw.js");
const createJwtTokenIdentiferExtractor = require("./src/authentication/get-token-identifier");
const createJwtTokenCreator = require("./src/authentication/create-jwt-token");

const logger = bunyan.createLogger({
    name: "api",
    src: true,
});

const db = makeDatabase(logger, process.env.DBCONNSTRING);
const jwtAuthMw = createJwtAuthMw(process.env.JWTSECRET);
const jwtIdentifierExtractor = createJwtTokenIdentiferExtractor(process.env.JWTSECRET);
const jwtTokenCreator = createJwtTokenCreator(process.env.JWTSECRET);

const serverCallback = createServerCallback({
    db,
    jwtAuthMw,
    jwtIdentifierExtractor,
    jwtTokenCreator,
    logger,
});

openPort(8080, serverCallback)
.then(httpServer => {
    logger.info("Server started on http://localhost:8080");
})
.catch(e => {
    logger.error(e, "startup error");
});
