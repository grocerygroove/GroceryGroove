require('dotenv').load();
global.Promise = require("bluebird");

const a = require("./src/utils/asyncify");
const bunyan = require("bunyan");
const createDatabaseConnection = require("database-connection");
const createJwtAuthMw = require("./src/middleware/create-jwt-auth");
const createJwtService = require("./src/http/jwt/create-service");
const createServerCallback = require("./src/server/create-callback");

const openHttpPort = (function () {
    const http = require("http");

    return function openHttpPort (port, callback) {
        return new Promise((resolve, reject) => {
            const listener = http.createServer(callback);
            listener.on("listening", () => {
                resolve(listener);
            });
            listener.on("error", error => {
                reject(error);
            });
            listener.listen(port);
        });
    };
})();

a(function* () {
    const mode = (
        (process.env.NODE_ENV === "development")
        ? "development"
        : "production"
    );

    const services = {
        db: createDatabaseConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            name: process.env.DB_NAME,
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
        }),

        jwt: createJwtService(process.env.JWTSECRET),

        logger: bunyan.createLogger({
            name: "api",
            src: true,
        }),
    };

    const middlewares = {
        authJwt: createJwtAuthMw(services.jwt, services.logger, () => Date.now()),
    };

    const serverCallback = createServerCallback(mode, services, middlewares);

    try {
        yield openHttpPort(8080, serverCallback);
        logger.info("Server started on http://localhost:8080");
    } catch (e) {
        logger.error(e, "startup error");
    }
})();
