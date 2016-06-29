const a = require("../utils/asyncify");
const camelize = require("change-case").camelCase;
const getRowFilter = require("./get-row-filter");
const makeParameterManager = require("./make-parameter-manager");
const parseJssql = require("./parse-jssql");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const statSync = require("fs").statSync;

const isDirectory = (path => statSync(path).isDirectory());
const stripExtension = (filename => filename.split(".").slice(0, -1).join("."));

module.exports = function makeQueryFunctionsFromDirectory (path) {
    const retval = {};
    const assign = function (name, item) {
        if (retval[name]) {
            if (typeof(retval[name]) === typeof(item)) {
                throw new Error(`Duplicate name: "${ name }"`);
            }

            switch (typeof retval[name]) {
                case "object":
                    retval[name] = Object.assign(item, retval[name]);
                break;

                case "function":
                    Object.assign(retval[name], item);
                break;

                default:
                    throw new Error(`unknown type "${ typeof retval[name] }" for "${ name }"`);
                break;
            }
        } else {
            retval[name] = item;
        }
    };

    for(const filename of readDirSync(path)){
        const pathname = `${ path }/${ filename }`;

        if (isDirectory(pathname)) {
            const name = camelize(filename);

            assign(name, makeQueryFunctionsFromDirectory(pathname));
        } else {
            const name = camelize(stripExtension(filename));

            if (filename.endsWith(".sql")) {
                const parsed = parseJssql(readFileSync(pathname, {
                    encoding: "utf8",
                }));
                const text = parsed.sql;

                const applyRowFilter = getRowFilter(parsed.attributes.returns);

                assign(name, a(function* (client, logger, values) {
                    const rows = yield client.query(logger, { name, text, values });
                    return applyRowFilter(rows);
                }));

            } else if (filename.endsWith(".js")) {
                const jsQuery = require(pathname);
                const applyRowFilter = getRowFilter(jsQuery.attributes.returns);

                assign(name, a(function* (client, logger, items) {
                    const resources = {
                        logger,
                        name,
                        pm: makeParameterManager(),
                    };

                    const queryArguments = jsQuery.main(resources, items);
                    const rows = yield client.query(logger, queryArguments);
                    return applyRowFilter(rows);
                }));
            } else {
                throw new Error(`Unrecognized query file type: "${ pathname }"`);
            }
        }
    }

    return retval;
};
