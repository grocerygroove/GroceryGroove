const applyRowFilter = require("./apply-row-filter");
const camelize = require("change-case").camelCase;
const collapse = require("./collapse");
const concat = require("./concat");
const convertSqlError = require("./convert-sql-error");
const extractNamedParameters = require("./extract-named-parameters");
const isDirectory = require("./is-directory-sync");
const makeParameterManager = require("./make-parameter-manager");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const requireStringAsFile = require("require-string-as-file");
const rf = require("./rename-function");
const separateJsSql = require("./separate-js-sql");
const stripExtension = require("./strip-extension");

module.exports = function createQueriesFromDirectory (parentFilenames, path) {
    if (arguments.length === 1) {
        return createQueriesFromDirectory([], parentFilenames);
    }

    const retval = {};
    const assign = (name, item) => collapse(retval, name, item);

    for (const filename of readDirSync(path)) {
        const pathname = `${ path }/${ filename }`;

        if (isDirectory(pathname)) {
            const filenames = concat(parentFilenames, filename);
            const name = camelize(filename);
            const queries = createQueriesFromDirectory(filenames, pathname);

            assign(name, queries);
        } else {
            const name = camelize(stripExtension(filename));
            const queryName = concat(parentFilenames, stripExtension(filename)).join("/");
            const functionName = queryName.split("/").join("_");

            if (!filename.startsWith(".") && filename.endsWith(".sql")) {
                const jsSql = separateJsSql(readFileSync(pathname, {
                    encoding: "utf8",
                }));

                const attributes = requireStringAsFile(pathname, `
                    module.exports = ${ jsSql.js };
                `);

                const { sql, parameterNames } = (
                    attributes.namedParameters
                    ? extractNamedParameters(jsSql.sql)
                    : ({
                        sql: jsSql.sql,
                        parameterNames: [],
                    })
                );

                const queryFn = rf(functionName, function (db, logger, values) {
                    return Promise.resolve()
                    .then(() => {
                        if (attributes.namedParameters) {
                            values = parameterNames.map(parameterName => values[parameterName]);
                        }

                        return db.query(
                            logger.createChild({
                                "query_name": queryFn.queryName,
                            }),

                            {
                                name: queryFn.queryName,
                                text: queryFn.sql,
                                values,
                            }
                        )
                        .then(
                            rows => applyRowFilter(queryFn.attributes.returns, rows),
                            error => Promise.reject(convertSqlError(pathname, queryFn.attributes.errorHandling, error))
                        );
                    });
                });

                Object.assign(queryFn, {
                    attributes,
                    parameterNames,
                    pathname,
                    queryName,
                    sql,
                });

                assign(name, queryFn);

            } else if (!filename.startsWith(".") && filename.endsWith(".js")) {
                const contents = require(pathname);
                const attributes = (
                    (typeof contents === "function")
                    ? ({
                        buildQuery: contents,
                    })
                    : contents
                );

                const queryFn = rf(functionName, function (db, logger, items) {
                    return Promise.resolve()
                    .then(() => {
                        const resources = {
                            logger: logger.child({
                                "query_name": queryFn.queryName,
                            }),
                            name: queryFn.queryName,
                            pm: makeParameterManager(),
                        };

                        const query = queryFn.attributes.buildQuery(resources, items);

                        return db.query(queryLogger, query)
                        .then(
                            rows => applyRowFilter(queryFn.attributes.returns, rows),
                            error => Promise.reject(convertSqlError(pathname, queryFn.attributes.errorHandling, error))
                        );
                    });
                });

                Object.assign(queryFn, {
                    attributes,
                    parameterNames: [],
                    pathname,
                    queryName,
                    sql: null,
                });
                assign(name, queryFn);
            }
        }
    }

    return retval;
};
