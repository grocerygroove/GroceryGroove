const makeQueryFunctionsFromDirectory = require("./make-query-functions-from-directory");

module.exports = makeQueryFunctionsFromDirectory(`${ __dirname }/queries`);
