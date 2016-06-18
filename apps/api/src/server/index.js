const createServer = require("http").createServer;
const express = require('express');
const bodyParser = require('body-parser');
const routes = [
    { path: "/users",       routerCreator: require("./routes/users")      },
    { path: "/households",  routerCreator: require("./routes/households") },
    { path: "/login",       routerCreator: require("./routes/login")      },
];

const Server = function (radford, jwtsecret) {
    if (typeof(radford) === "undefined") {
        throw new Error("Must pass radford");
    }
    this.radford = radford;
    this.jwtsecret = jwtsecret;

    this.servers = {};
};

Object.assign(Server.prototype, {
    getExpress: function () {
        if (!this.express) {
            this.express = express();
            this.express.use(bodyParser.json());
            for (let { path, routerCreator } of routes) {
                this.express.use(path, routerCreator(this.radford, this.jwtsecret));
            }
            this.express.use((error, req, res, next) => {
                res.sendStatus(503);
                console.log(error);
            });
        }

        return this.express;
    },

    getServer: function (port) {
        if (!this.servers[port]) {
            const server = createServer(this.getExpress());

            this.servers[port] = {
                isRunning: false,
                start: () => new Promise((resolve, reject) => {
                    if (this.servers[port].isRunning) {
                        reject(new Error(`Server on port ${ port } is already running.`));
                        return;
                    }

                    server.once("listening", () => {
                        this.servers[port].isRunning = true;

                        resolve(server);
                    });
                    server.once("error", error => {
                        reject(error);
                    });

                    server.listen(port);
                }),

                stop: () => new Promise((resolve, reject) => {
                    if (!this.servers[port].isRunning) {
                        reject(new Error(`Server on port ${ port } is not running`));
                        return;
                    }

                    server.once("close", () => {
                        this.servers[port].isRunning = false;

                        resolve();
                    });
                    server.once("error", error => {
                        reject(error);
                    });
                    server.close()
                }),
            };
        }

        return this.servers[port];
    },

    start: function (port) {
        return this.getServer(port).start();
    },
    stop: function (port) {
        return this.getServer(port).stop();
    },
});

module.exports = Server;
