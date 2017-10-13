module.exports = () => function convertSqlErrorsToExceptions (queryArgs) {
    if (!queryArgs.attributes.errorStateToExceptionMap) {
        return queryArgs;
    }

    return Object.assign({}, queryArgs, {
        result: queryArgs.result.catch(error => {
          let ErrorClass;
          if(typeof(queryArgs.attributes.errorStateToExceptionMap[error.code]) === 'function') {
            ErrorClass = queryArgs.attributes.errorStateToExceptionMap[error.code](error);
          } else {
            ErrorClass = queryArgs.attributes.errorStateToExceptionMap[error.code];
          }

            if (ErrorClass) {
                return Promise.reject(new ErrorClass(error, queryArgs.pathname));
            } else {
                return Promise.reject(error);
            }
        }),
    });
};
