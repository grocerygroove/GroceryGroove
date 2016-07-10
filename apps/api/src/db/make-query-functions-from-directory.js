const makeQueryFunctionsFromDirectoryActual = require("./make-query-functions-from-directory/index");

module.exports = function makeQueryFunctionsFromDirectory (path) {
    return makeQueryFunctionsFromDirectoryActual([], path);
};
