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

                assign(name, rf(functionName, function (db, logger, values) {
                    return Promise.resolve()
                    .then(() => {
                        if (attributes.namedParameters) {
                            values = parameterNames.map(parameterName => values[parameterName]);
                        }

                        return db.query(
                            logger.createChild({
                                "query_name": queryName,
                            }),

                            {
                                name: queryName,
                                text: sql,
                                values,
                            }
                        )
                        .then(
                            rows => applyRowFilter(attributes.returns, rows),
                            error => Promise.reject(convertSqlError(pathname, attributes.errorHandling, error))
                        );
                    });
                }));

            } else if (!filename.startsWith(".") && filename.endsWith(".js")) {
                const contents = require(pathname);
                const contentObject = (
                    (typeof contents === "function")
                    ? ({
                        buildQuery: contents,
                    })
                    : contents
                );

                assign(name, rf(functionName, function (db, logger, items) {
                    return Promise.resolve()
                    .then(() => {
                        const resources = {
                            logger: logger.child({
                                "query_name": queryName,
                            }),
                            name: queryName,
                            pm: makeParameterManager(),
                        };

                        const query = contentObject.buildQuery(resources, items);

                        return db.query(queryLogger, query)
                        .then(
                            rows => applyRowFilter(contentObject.returns, rows),
                            error => Promise.reject(convertSqlError(pathname, contentObject.errorHandling, error))
                        );
                    });
                }));
            }
        }
    }

    return retval;
};
