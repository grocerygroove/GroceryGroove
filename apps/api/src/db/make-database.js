const pg = require("pg.promised")(require("pg-native"));
const phinally = require("phinally");
const queries = require("./queries");

const makeDatabase = function (logger, connString) {
    const connect = function () {
        return pg.connect(connString)
        .then(({ client, done }) => {
            // Override query to log the arguments
            const oldQuery = query;
            client.query = function (...args) {
                logger.info({
                    query: args,
                });
                return oldQuery.apply(this, args);
            };

            // Add queries to client
            client.queries = queries.prepareFor(client);

            // Undo the override
            const oldDone = done;
            done = function () {
                client.query = oldQuery;
                client.queries = void(0);
                return oldDone.call(this);
            };

            return { client, done };
        })
        ;
    };

    const using = function (promisor) {
        return connect()
        .then(({ client, done }) => {
            return Promise.resolve(promisor(client))
            ::phinally(() => done())
            ;
        })
        ;
    };

    return {
        connect,
        using,
    };
};

module.exports = makeDatabase;
