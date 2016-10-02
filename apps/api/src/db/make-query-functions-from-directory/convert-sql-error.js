module.exports = function convertSqlError (pathname, handlers, error) {
    if (handlers) {
        if (error.code && handlers.states[error.code]) {
            const ErrorClass = handlers.states[error.code];

            return new ErrorClass(error, pathname);
        } else if (error.sqlState) {
            return new Error(`Sql Error ${error.code} not caught for ${pathname}`);
        }
    } else if (error.sqlState) {
            return new Error(`Sql Error ${error.code} not caught for ${pathname}`);
    }

    return void(0);

};
