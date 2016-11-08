const createQueriesFromDirectory = require("database-files").createQueriesFromDirectory;

module.exports = createQueriesFromDirectory(`${ __dirname }/queries`);
