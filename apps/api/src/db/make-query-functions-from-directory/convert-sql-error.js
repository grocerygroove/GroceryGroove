module.exports = function convertSqlError(pathname, handlers, error) {
    if (handlers) {
        if (error.sqlState && handlers.state[error.sqlState]) {
            const ErrorClass = handlers.state[error.sqlState];

            return new ErrorClass(error, pathname);
        }
    }
};
