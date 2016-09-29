const a = require("../utils/asyncify");
const Pool = require("pg").Pool;

const queryLogged = (function () {
    const rowsAsPlainObjects = function () {
        return this.map(row => Object.assign({}, row));
    };

    return function queryLogged (query, logger, ...args) {
        logger.info({
            "db_query": args,
        });

        return query(...args).then(result => {
            // Swap these as we care more about the rows than the result object.
            // Possible optimisation point: I've heard that `delete` is slow but not
            // sure if that's still a thing.
            const rows = result.rows;
            delete result.rows;
            rows.result = result;

            // Individual rows returned from pg aren't regular objects but
            // actually prototype instances. Attaching this function to the rows
            // array allows the caller to convert the rows back to plain objects
            rows.asPlainObjects = rowsAsPlainObjects;

            return rows;
        });
    };
})();

module.exports = function makeDatabase ({ user, password, name, host, port }) {
    const pool = new Pool({
        user,
        password,
        database: name,
        port,
        host,
    });

    /**
     * Grab a connection from the pool. Extend the `client` object with its
     * function to release to the pool and override the query function to
     * be promise-based.
     *
     * Note that it is up to the caller to call `client.release()` and release
     * the client object back into the pool. `query`, and `transaction` do this
     * automatically for you so use of this function is discouraged.
     */
    const connect = function connect () {
        return pool.connect()
        .then(client => {
            if (!client._originalQueryBound) {
                client._query = client.query;
                client.query = queryLogged.bind(null, client._query.bind(client));
            }

            return client;
        });
    };

    const query = queryLogged.bind(null, pool.query.bind(pool));

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
            connect().then(
                client => {
                    client.query(logger, "BEGIN")
                    .then(() => callback(client))
                    .then(
                        callbackValue => client.query(logger, "COMMIT").then(
                            commitSuccess => {
                                client.release();
                                resolve(callbackValue);
                            },
                            commitError => {
                                client.release();
                                reject(commitError);
                            }
                        ),

                        callbackError => client.query(logger, "ROLLBACK").then(
                            rollbackSuccess => {
                                client.release();
                                reject(callbackError);
                            },
                            rollbackError => {
                                client.release();
                                rollbackError.callbackError = callbackError;
                                reject(rollbackError);
                            }
                        )
                    )
                },
                connectError => {
                    reject(connectError);
                }
            );
        });
    };

    const end = function end () {
        return pool.end();
    };

    return {
        connect,
        end,
        query,
        transaction,
    };
};
