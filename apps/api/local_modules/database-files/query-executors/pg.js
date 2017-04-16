module.exports = function pgQueryExecutorCreator () {
    return ({
        conn,
        name,
        sql,
        values,
    }) => conn.query({
        name,
        text: sql,
        values,
    });
};
