const a = require("../utils/asyncify");
const camelize = require("change-case").camelCase;
const getRowFilter = require("./get-row-filter");
const makeParameterManager = require("./make-parameter-manager");
const parseJssql = require("./parse-jssql");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;

const queryPath = `${ __dirname }/queries`;

const queryFunctions = {};
for (let filename of readDirSync(queryPath)) {
    const pathname = `${ queryPath }/${ filename }`;
    const name = camelize(filename.split(".")[0]);

    if (filename.endsWith(".sql")) {
        const parsed = parseJssql(readFileSync(pathname, {
            encoding: "utf8",
        }));
        const text = parsed.sql;

        const applyRowFilter = getRowFilter(parsed.attributes.returns);

        queryFunctions[name] = a(function* (client, values) {
            const rows = yield(client.query({ name, text, values }));
            return applyRowFilter(rows);
        });
    }

    if (filename.endsWith(".js")) {
        const jsQuery = require(pathname);
        const applyRowFilter = generatePostQueryFilter(jsQuery.attributes.returns);

        queryFunctions[name] = a(function* (client, items) {
            const resources = {
                name,
                pm: makeParameterManager(),
            };

            const queryArguments = jsQuery.run(resources, items);
            const rows = yield(client.query(queryArguments));
            return applyRowFilter(rows);
        });
    }
}

module.exports = queryFunctions;
