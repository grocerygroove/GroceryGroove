const a = require("../utils/asyncify");
const pg = require("pg").native;

module.exports = function makeDatabase (connString) {
    /**
     * Grab a connection from the pool. Extend the `client` object with its
     * function to release to the pool and override the query function to
     * be promise-based.
     *
     * Note that it is up to the caller to call `client.done()` and release the
     * client object back into the pool. `query`, and `transaction` do this
     * automatically for you so use of this function is discouraged.
     */
    const getClient = function getClient () {
        return new Promise((resolve, reject) => {
            pg.connect(connString, (error, client, done) => {
                if (error) {
                    return reject(error);
                }

                return resolve(Object.assign({}, client, {
                    done: done,
                    query: function clientQuery (logger, ...args) {
                        return new Promise((resolve, reject) => {
                            logger.info({
                                "db_query": args,
                            });

                            client.query(...args, (error, result) => {
                                if (error) {
                                    return reject(error);
                                }

                                // Swap these as we care more about the rows
                                // than the result object. Possible optimisation
                                // point: I've heard that `delete` is slow but
                                // not sure if that's still a thing.
                                const rows = result.rows;
                                delete result.rows;
                                rows.result = result;

                                return resolve(rows);
                            });
                        });
                    },
                }));
            });
        });
    };

    /**
     * This function should be thought of `databasePool.query`. It grabs a
     * client from the pool, runs the query, and releases the client. Subsequent
     * invocations to this function should consider each client to be unique
     * from the previous invocations.
     */
    const query = function query (logger, ...args) {
        return getClient()
        .then(client => client.query(logger, ...args)
            .then(
                value => {
                    client.done();
                    return value;
                },
                error => {
                    client.done();
                    return Promise.reject(error);
                }
            )
        );
    };

    /**
     * Run a callback inside a transaction. Essentially, this grabs a connection
     * from the pool, runs the callback (and the callback should return a
     * promise so that this function can wait until it's finished with the
     * connection) and then COMMITs the transaction if the callback's promise
     * resolves and ROLLBACKs the transaction if it rejects.
     *
     * Note that the 2-arg form is used here so that errors are properly
     * propagated. Multiple branches are needed due to COMMITs and ROLLBACKs
     * being possible to fail as well.
     *
     * In the case that a ROLLBACK is required and fails, the original error
     * is attached to the ROLLBACK error.
     */
    const transaction = function transaction (logger, callback) {
        return new Promise((resolve, reject) => {
            getClient().then(
                client => {
                    client.query(logger, "BEGIN")
                    .then(() => callback(client))
                    .then(
                        callbackValue => client.query(logger, "COMMIT").then(
                            commitSuccess => {
                                client.done();
                                resolve(callbackValue);
                            },
                            commitError => {
                                client.done();
                                reject(commitError);
                            }
                        ),

                        callbackError => client.query(logger, "ROLLBACK").then(
                            rollbackSuccess => {
                                client.done();
                                reject(callbackError);
                            },
                            rollbackError => {
                                client.done();
                                rollbackError.callbackError = callbackError;
                                reject(rollbackError);
                            }
                        )
                    )
                },
                getClientError => {
                    reject(getClientError);
                }
            );
        });
    };

    return {
        getClient,
        query,
        transaction,
    };
};
