const withResourceNow = function pgWithResourceNow (res) {
    return (runQuery, queryArgs) => (values) => runQuery(Object.assign({}, queryArgs, {
        conn: res,
        values,
    }));
};

const withResourceLater = function pgWithResourceLater () {
    return (runQuery, queryArgs) => (res, values) => runQuery(Object.assign({}, queryArgs, {
        conn: res,
        values,
    }));
};

module.exports = function pgInterfaceGeneratorCreator (resOrNothing) {
    if (resOrNothing) {
        return withResourceNow(resOrNothing);
    } else {
        return withResourceLater(resOrNothing);
    }
};
