const a = require("../utils/asyncify");
const camelize = require("change-case").camelCase;
const getRowFilter = require("./get-row-filter");
const makeParameterManager = require("./make-parameter-manager");
const parseJssql = require("./parse-jssql");
const path = require('path');
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const statSync = require("fs").statSync;

const queryPath = `${ __dirname }/queries`;

const recursiveGrabSqlFiles = function(dir, fileList){
    const files = readDirSync(dir);
    fileList = fileList || [];
    files.forEach(function(file) {
        if (statSync(dir + '/' + file).isDirectory()) {
            fileList = recursiveGrabSqlFiles(dir + '/' + file + '/', fileList);
        }
        else if (file.endsWith('.sql') || file.endsWith('.js')) {
            fileList.push(dir + file);
        }
    });
    return fileList;
};

const queryFunctions = {};
const sqlFileList = recursiveGrabSqlFiles(queryPath);
for(let pathname of sqlFileList){
    const filename = path.basename(pathname);
    const name = camelize(filename.split(".")[0]);

    if (filename.endsWith(".sql")) {
        const parsed = parseJssql(readFileSync(pathname, {
            encoding: "utf8",
        }));
        const text = parsed.sql;

        const applyRowFilter = getRowFilter(parsed.attributes.returns);

        queryFunctions[name] = a(function* (client, logger, values) {
            const rows = yield(client.query(logger, { name, text, values }));
            return applyRowFilter(rows);
        });
    }

    if (filename.endsWith(".js")) {
        const jsQuery = require(pathname);
        const applyRowFilter = generatePostQueryFilter(jsQuery.attributes.returns);

        queryFunctions[name] = a(function* (client, logger, items) {
            const resources = {
                name,
                pm: makeParameterManager(),
            };

            const queryArguments = jsQuery.run(resources, items);
            const rows = yield(client.query(logger, queryArguments));
            return applyRowFilter(rows);
        });
    }
}

module.exports = queryFunctions;
