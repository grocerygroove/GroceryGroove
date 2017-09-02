const databaseFiles = require("database-files");

module.exports = databaseFiles.transactionsSync(`${ __dirname }/queries`, {
    generateInterface: (runTransaction, transactionArgs) => function (conn, logger, args) {
        return runTransaction(Object.assign({}, transactionArgs, {
            args,
            conn,
            logger,
        }));
    },

    preprocessors: [
        databaseFiles.transactionPreprocessors.customizeLogger(),
    ],

    postprocessors: [
    ],

    executor: ({
        args,
        conn,
        logger,
        transactionFn,
    }) =>
        conn.transaction(client => transactionFn(client, logger, args))
    ,
});
