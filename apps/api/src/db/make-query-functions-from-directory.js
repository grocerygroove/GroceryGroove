const a = require("../utils/asyncify");
const applyRowFilter = require("./make-query-functions-from-directory/apply-row-filter");
const camelize = require("change-case").camelCase;
const makeParameterManager = require("./make-parameter-manager");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const requireStringAsFile = require("../utils/require-string-as-file");
const separateJsSql = require("./make-query-functions-from-directory/separate-js-sql");
const statSync = require("fs").statSync;
const convertSqlError = require("./make-query-functions-from-directory/convert-sql-error");

const isDirectory = (path => statSync(path).isDirectory());
const stripExtension = (filename => filename.split(".").slice(0, -1).join("."));

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
            break;
        }
    } else {
        queries[name] = item;
    }
};

module.exports = function makeQueryFunctionsFromDirectory (path) {
    const retval = {};
    const assign = (name, item) => collapseQueries(retval, name, item);

    for(const filename of readDirSync(path)){
        const pathname = `${ path }/${ filename }`;

        if (isDirectory(pathname)) {
            const name = camelize(filename);

            assign(name, makeQueryFunctionsFromDirectory(pathname));
        } else {
            const name = camelize(stripExtension(filename));

            if (filename.endsWith(".sql")) {
                const { js, sql } = separateJsSql(readFileSync(pathname, {
                    encoding: "utf8",
                }));

                const attributes = requireStringAsFile(pathname, `
                    module.exports = ${ js };
                `);

                assign(name, a(function* (client, logger, values) {
                    try {
                        const rows = yield client.query(logger, {
                            name,
                            text: sql,
                            values,
                        });
                        return applyRowFilter(attributes.returns, rows);

                    } catch(error) {
                        throw (convertSqlError(pathname, attributes.errorHandling, error) || error);
                    }
                }));

            } else if (filename.endsWith(".js")) {
                const jsQuery = require(pathname);

                assign(name, a(function* (client, logger, items) {
                    const resources = {
                        logger,
                        name,
                        pm: makeParameterManager(),
                    };

                    const queryArguments = jsQuery.main(resources, items);
                    const rows = yield client.query(logger, queryArguments);
                    return applyRowFilter(jsQuery.attributes.returns, rows);
                }));
            }
        }
    }

    return retval;
};
