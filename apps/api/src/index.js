require('dotenv').load();
global.Promise = require("bluebird");

const bunyan = require("bunyan");
const makeDatabase = require("./db/make-database");
const Radford = require("radford");
const Server = require("./server");

try {
    const radford = new Radford({
        db: {
            cache: true,
            dependencies: [
                ["logger", {
                    name: "db",
                }],
            ],
            create: ({ logger }) => {
                return makeDatabase(logger, process.env.DBCONNSTRING);
            },
        },
        logger: {
            cache: ({ name }) => name,
            dependencies: [
                "db",
            ],
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
    });

    const server = new Server(radford);

    server.start(8080)
    .then(() => {
        console.log(`Server started on http://localhost:8080/`);
    })
    .catch(e => {
        console.log(e);
        console.log(e.message);
        console.log(e.stack);
    })
    ;

} catch(e) {
    console.log(e);
    console.log(e.message);
    console.log(e.stack);
}
