global.Promise = require("bluebird");
const bunyan = require("bunyan");
const makeDatabase = require("./db/make-database");
const Radford = require("radford");
const Server = require("./server");

const radford = new Radford({
    definitions: {
        db: {
            cache: true,
            dependencies: [
                ["logger", {
                    name: "db",
                }],
            ],
            create: ({ logger }) => {
                return makeDatabase(logger, process.env.DB_CONN_STRING);
            },
        },
        logger: {
            cache: ({ name }) => name,
            create: ({}, { name }) => {
                if (process.env.NODE_ENV === "production") {
                    return bunyan.createLogger({
                        name,
                    });
                } else {
                    return bunyan.createLogger({
                        name,
                        src: true,
                    });
                }
            },
        },
    },
});
