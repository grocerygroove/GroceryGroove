const a = require("../../utils/asyncify");
const applyRowFilter = require("./apply-row-filter");
const camelize = require("change-case").camelCase;
const concat = require("../../utils/concat");
const isDirectory = require("../../utils/is-directory-sync");
const makeParameterManager = require("../make-parameter-manager");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const requireStringAsFile = require("require-string-as-file");
const separateJsSql = require("./separate-js-sql");
const convertSqlError = require("./convert-sql-error");

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
        }
    } else {
        queries[name] = item;
    }
};

module.exports = function makeQueryFunctionsFromDirectory (parentFilenames, path) {
    const retval = {};
    const assign = (name, item) => collapseQueries(retval, name, item);

    for (const filename of readDirSync(path)) {
        const pathname = `${ path }/${ filename }`;

        if (isDirectory(pathname)) {
            const filenames = concat(parentFilenames, filename);
            const name = camelize(filename);
            const queries = makeQueryFunctionsFromDirectory(filenames, pathname);

            assign(name, queries);
        } else {
            const name = camelize(stripExtension(filename));
            const queryName = concat(parentFilenames, stripExtension(filename)).join("/");

            if (filename.endsWith(".sql")) {
                const { js, sql } = separateJsSql(readFileSync(pathname, {
                    encoding: "utf8",
                }));

                const attributes = requireStringAsFile(pathname, `
                    module.exports = ${ js };
                `);

                const queryGeneratorFunction = function* (client, logger, values) {
                    try {
                        const rows = yield client.query(logger, {
                            name: queryName,
                            text: sql,
                            values,
                        });

                        return applyRowFilter(attributes.returns, rows);
                    } catch (error) {
                        throw (convertSqlError(pathname, attributes.errorHandling, error) || error);
                    }
                };
                Object.defineProperty(queryGeneratorFunction, "name", {
                    value: `${ queryName.replace("/", "_") }_sql`,
                });

                const queryFunction = a(queryGeneratorFunction);
                assign(name, queryFunction);

            } else if (filename.endsWith(".js") && !(filename.substring(0, 1) === ".")) {
                const jsQuery = require(pathname);

                const queryGeneratorFunction = function* (client, logger, items) {
                    const resources = {
                        logger,
                        name: queryName,
                        pm: makeParameterManager(),
                    };

                    const queryArguments = jsQuery.main(resources, items);
                    const rows = yield client.query(logger, queryArguments);
                    return applyRowFilter(jsQuery.attributes.returns, rows);
                };
                Object.defineProperty(queryGeneratorFunction, "name", {
                    value: `${ queryName.replace("/", "_") }_js`,
                });

                const queryFunction = a(queryGeneratorFunction);
                assign(name, queryFunction);
            }
        }
    }

    return retval;
};
