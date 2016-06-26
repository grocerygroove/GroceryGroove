const a = require("../util/asyncify");
const pg = require("pg").native;
const queries = require("./queries");

module.exports = function makeDatabase (logger, connString) {
    const connect = function () {
        return new Promise((resolve, reject) => {
            pg.connect(connString, (error, client, done) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    done,
                    client: {
                        query: function (...args) {
                            return new Promise((resolve, reject) => {
                                client.query(...args, (error, result) => {
                                    if (error) {
                                        return reject(error);
                                    }

                                    return resolve(result.rows);
                                });
                            });
                        },
                    },
                });
            });
        });
    };

    const using = a(function* (promisor) {
        const { client, done } = yield(connect());
        try {
            return Promise.resolve(promisor(client));
        } finally {
            done();
        }
    });

    const query = function (...args) {
        return using(client => client.query(...args));
    };

    const transaction = a(function* (promisor) {
        return using(a(function* (client) {
            yield(query("BEGIN"));

            try {
                const value = yield(Promse.resolve(promisor(client)));
                yield(client.query("COMMIT"));
                return value;
            } catch (e) {
                yield(client.query("ROLLBACK"));
                throw e;
            }
        }));
    });

    return {
        connect,
        using,
        query,
        transaction,
    };
};
