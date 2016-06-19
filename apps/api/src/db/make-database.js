const pg = require("pg").native;
const queries = require("./queries");

const makeDatabase = function (logger, connString) {
    const connect = function () {
        return new Promise((resolve, reject) => {
            pg.connect(connString, (error, client, done) => {
                if (error) {
                    return reject(error);
                }

                const promisedClient = {};
                promisedClient.query = function (...args) {
                    return new Promise((resolve, reject) => {
                        client.query(...args, (error, result) => {
                            if (error) {
                                return reject(error);
                            }

                            return resolve(result.rows);
                        });
                    });
                };
                promisedClient.queries = queries.prepareFor(promisedClient);

                resolve({
                    done,
                    client: promisedClient,
                });
            });
        });
    };

    const using = function (promisor) {
        return connect()
        .then(({ client, done }) => {
            return Promise.resolve(promisor(client)).then(
                value => {
                    done();
                    return Promise.resolve(value);
                },
                error => {
                    done();
                    return Promise.reject(error);
                }
            );
        })
        ;
    };

    return {
        connect,
        using,
    };
};

module.exports = makeDatabase;
