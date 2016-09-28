const a = require("../utils/asyncify");
const pg = require("pg").native;

module.exports = function makeDatabase (connString) {
    const connect = function () {
        return new Promise((resolve, reject) => {
            pg.connect(connString, (error, client, done) => {
                if (error) {
                    return reject(error);
                }

                return resolve({
                    done,
                    client: {
                        query: function (logger, ...args) {
                            return new Promise((resolve, reject) => {
                                logger.info({
                                    "db_query": args,
                                });

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
        const { client, done } = yield connect();

        try {
            return Promise.resolve(promisor(client));
        } finally {
            done();
        }
    });

    const query = function (logger, ...args) {
        return using(client => client.query(logger, ...args));
    };

    const transaction = a(function* (logger, promisor) {
        return using(a(function* (client) {
            yield client.query(logger, "BEGIN");

            try {
                const value = yield Promse.resolve(promisor(client));
                yield client.query(logger, "COMMIT");
                return value;
            } catch (e) {
                yield client.query(logger, "ROLLBACK");
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
