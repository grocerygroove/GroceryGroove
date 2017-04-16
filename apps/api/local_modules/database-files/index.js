const createQueriesFromDirectorySync      = require("./create-queries-from-directory-sync");
const createTransactionsFromDirectorySync = require("./create-transactions-from-directory-sync");

module.exports = {
    queriesSync: (path, opts) => createQueriesFromDirectorySync([], path, opts),

    queryExecutors: {
        pg: require("./query-executors/pg"),
    },

    queryInterfaceGenerators: {
        pg: require("./query-interface-generators/pg"),
    },

    queryPreprocessors: {
        customizeLogger: require("./query-preprocessors/customize-logger"),
        namedParameters: require("./query-preprocessors/named-parameters"),
    },

    queryPostprocessors: {
        applyReturnFiltering:         require("./query-postprocessors/apply-return-filtering"),
        convertSqlErrorsToExceptions: require("./query-postprocessors/convert-sql-errors-to-exceptions"),
    },

    transactionsSync: (path, opts) => createTransactionsFromDirectorySync([], path, opts),

    transactionPreprocessors: {
        customizeLogger: require("./transaction-preprocessors/customize-logger.js"),
    },

    transactionPostprocessors: {
    },
};
