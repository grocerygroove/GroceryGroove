module.exports = function transformSqlError(pathname, errorStates, error) {
    if (!error.sqlState) {
        return error;
    }

    var errorState = errorStates.filter((obj) =>{
        return obj.state === error.sqlState;
    })[0];

    if (errorState && errorState.message) {
        return new Error(errorState.message);
    } else {
        return new Error(`pathname: ${ pathname }; Sql Error State:'${ error.sqlState }' not handled`);
    }
};
