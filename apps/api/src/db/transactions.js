const createTransactionsFromDirectory = require("database-files").createTransactionsFromDirectory;

module.exports = createTransactionsFromDirectory(`${ __dirname }/transactions`);
