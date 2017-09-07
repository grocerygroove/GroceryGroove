module.exports = () => function convertSqlErrorsToExceptions (queryArgs) {
    if (!queryArgs.attributes.errorStateToExceptionMap) {
        return queryArgs;
    }

    return Object.assign({}, queryArgs, {
        result: queryArgs.result.catch(error => {
            const ErrorClass = queryArgs.attributes.errorStateToExceptionMap[error.code];

            if (ErrorClass) {
                return Promise.reject(new ErrorClass(error, queryArgs.pathname));
            } else {
                return Promise.reject(error);
            }
        }),
    });
};
