module.exports = function convertSqlError(pathname, handlers, error) {
    if (handlers) {
        if (error.sqlState && handlers.states[error.sqlState]) {
            const ErrorClass = handlers.states[error.sqlState];

            return new ErrorClass(error, pathname);
        }
    }
};
