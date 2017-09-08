const databaseFiles = require("database-files");
const pgTransaction = require("pg-transaction");

module.exports = databaseFiles.transactionsSync(`${ __dirname }/transactions`, {
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
    pgTransaction(conn, transactionFn, logger, args),
});
