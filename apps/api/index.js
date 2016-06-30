require('dotenv').load();
global.Promise = require("bluebird");

const bunyan = require("bunyan");
const createJwtAuthMw = require("./src/middleware/create-jwt-auth");
const createJwtService = require("./src/http/jwt/create-service");
const createServerCallback = require("./src/server/create-callback");
const makeDatabase = require("./src/db/make-database");
const openHttpPort = require("./src/http/open-http-port");
const getTime = require('./src/utils/get-time');

const logger = bunyan.createLogger({
    name: "api",
    src: true,
});

const db = makeDatabase(process.env.DBCONNSTRING);
const jwtService = createJwtService(process.env.JWTSECRET);

const jwtAuthMw = createJwtAuthMw(jwtService, logger, getTime);

const serverCallback = createServerCallback({
    db,
    jwtService,
    jwtAuthMw,
    logger,
});

openHttpPort(8080, serverCallback)
.then(httpServer => {
    logger.info("Server started on http://localhost:8080");
})
.catch(e => {
    logger.error(e, "startup error");
});
