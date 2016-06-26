const pg = require("pg").native;
const queries = require("./queries");

const makeDatabase = function (logger, connString) {
    const connect = function () {
        return new Promise((resolve, reject) => {
            pg.connect(connString, (error, client, done) => {
                if (error) {
                    return reject(error);
                }

                resolve({
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
                    done,
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

    const query = function (...args) {
        return using(client => client.query(...args));
    };

    const transaction = function (promisor) {
        return using(client => promisor(client)
            .then(
                value => {
                    return client.query("COMMIT")
                    .then(Promise.resolve(value))
                    ;
                },
                error => {
                    return client.query("ROLLBACK")
                    .then(Promise.reject(error))
                    ;
                }
            )
        );
    };

    return {
        connect,
        using,
        query,
        transaction,
    };
};

module.exports = makeDatabase;
