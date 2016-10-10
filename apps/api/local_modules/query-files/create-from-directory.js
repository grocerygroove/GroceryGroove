const applyRowFilter = require("./apply-row-filter");
const camelize = require("change-case").camelCase;
const convertSqlError = require("./convert-sql-error");
const isDirectory = require("./is-directory-sync");
const makeParameterManager = require("./make-parameter-manager");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const requireStringAsFile = require("require-string-as-file");
const separateJsSql = require("./separate-js-sql");

const stripExtension = (filename => filename.split(".").slice(0, -1).join("."));
const nf = function (name, func) {
    Object.defineProperty(func, "name", {
        value: name,
    });

    return func;
};

const concat = (...arrays) => [].concat(...arrays);

/**
 * Helper function to help deal with the issue of having a
 * `${path}/something.js` file and a bunch of files under the
 * `${path}/something/` directory. This handles that by looking to see when you
 * try to assign an item to a name, if one of them is an object (a directory)
 * and one of the is a function (a file), then it applies all of the object's
 * properties to the function and sets that function in the place of `name`.
 *
 * NOTE: This function modifies its arguments.
 */
const collapseQueries = function (queries, name, item) {
    if (queries[name]) {
        if (typeof(queries[name]) === typeof(item)) {
            throw new Error(`Duplicate name: "${ name }"`);
        }

        switch (typeof queries[name]) {
            case "object":
                queries[name] = Object.assign(item, queries[name]);
            break;

            case "function":
                Object.assign(queries[name], item);
            break;

            default:
                throw new Error(`unknown type "${ typeof queries[name] }" for "${ name }"`);
        }
    } else {
        queries[name] = item;
    }
};

module.exports = function createFromDirectory (parentFilenames, path) {
    if (arguments.length === 1) {
        return createFromDirectory([], parentFilenames);
    }

    const retval = {};
    const assign = (name, item) => collapseQueries(retval, name, item);

    for (const filename of readDirSync(path)) {
        const pathname = `${ path }/${ filename }`;

        if (isDirectory(pathname)) {
            const filenames = concat(parentFilenames, filename);
            const name = camelize(filename);
            const queries = createFromDirectory(filenames, pathname);

            assign(name, queries);
        } else {
            const name = camelize(stripExtension(filename));
            const queryName = concat(parentFilenames, stripExtension(filename)).join("/");
            const functionName = queryName.split("/").join("_");

            if (filename.endsWith(".sql")) {
                const { js, sql } = separateJsSql(readFileSync(pathname, {
                    encoding: "utf8",
                }));

                const attributes = requireStringAsFile(pathname, `
                    module.exports = ${ js };
                `);

                assign(name, nf(functionName, function (client, logger, values) {
                    const queryLogger = logger.child({
                        "query_name": queryName,
                    });

                    return client.query(queryLogger, {
                        name: queryName,
                        text: sql,
                        values,
                    })
                    .then(
                        rows => applyRowFilter(attributes.returns, rows),
                        error => Promise.reject(convertSqlError(pathname, attributes.errorHandling, error) || error)
                    );
                }));

            } else if (!filename.startsWith(".") && filename.endsWith(".js")) {
                const jsQuery = require(pathname);

                assign(name, nf(functionName, function (client, logger, items) {
                    try {
                        const queryLogger = logger.child({
                            "query_name": queryName,
                        });

                        const resources = {
                            logger: queryLogger,
                            name: queryName,
                            pm: makeParameterManager(),
                        };

                        const queryArguments = jsQuery.main(resources, items);

                        return client.query(queryLogger, queryArguments)
                        .then(
                            rows => applyRowFilter(jsQuery.attributes.returns, rows),
                            error => Promise.reject(convertSqlError(pathname, jsQuery.attributes.errorHandling, error) || error)
                        );
                    } catch (e) {
                        return Promise.reject(e);
                    }
                }));
            }
        }
    }

    return retval;
};
