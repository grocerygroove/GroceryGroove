module.exports = function convertSqlError (pathname, handlers, error) {
    if (error.code && handlers && handlers.states[error.code]) {
        const ErrorClass = handlers.states[error.code];

        return new ErrorClass(error, pathname);
    } else {
        return error;
    }
};
