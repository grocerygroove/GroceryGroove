require('dotenv').load();
global.Promise = require("bluebird");

const bunyan = require("bunyan");
const makeDatabase = require("./src/db/make-database");
const createServerCallback = require("./src/server/create-callback");
const openPort = require("./src/http/open-port");

const logger = bunyan.createLogger({
    name: "api",
    src: true,
});

const db = makeDatabase(logger, process.env.DBCONNSTRING);
const serverCallback = createServerCallback({
    db,
    logger,
});

openPort(8080, serverCallback)
.then(httpServer => {
    logger.info("Server started on http://localhost:8080");
})
.catch(e => {
    logger.error(e, "startup error");
});
