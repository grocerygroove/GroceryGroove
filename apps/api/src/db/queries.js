const customizeQueryLogger = require("./customize-query-logger");
const databaseFiles = require("database-files");

module.exports = databaseFiles.queriesSync(`${ __dirname }/queries`, {
    preprocessors: [
        customizeQueryLogger(),
        databaseFiles.queryPreprocessors.namedParameters(),
    ],

    postprocessors: [
        databaseFiles.queryPostprocessors.applyReturnFiltering(),
        databaseFiles.queryPostprocessors.convertSqlErrorsToExceptions(),
    ],

    //generateInterface: databaseFiles.queryInterfaceGenerators.pg(pool), => someQuery(["hello", "world"])
    //generateInterface: databaseFiles.queryInterfaceGenerators.pg(),     => someQuery(pool, ["hello", "world"])
    generateInterface: (runQuery, queryArgs) => function (conn, logger, values) {
        return runQuery(Object.assign({}, queryArgs, {
            conn,
            logger,
            values,
        }));
    },

    //executor: databaseFiles.queryExecutors.ndbi,
    //executor: databaseFiles.queryExecutors.pg
    executor: ({
        conn,
        logger,
        name,
        sql,
        values,
    }) => {
        logger.info({
            "db_query": {
                name,
                sql,
                values,
            },
        });

        return conn.query({
            name,
            text: sql,
            values,
        })
    },

});
