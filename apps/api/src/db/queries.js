const camelize = require("change-case").camelCase;
const json5 = require("json5");
const makeParameterManager = require("./make-parameter-manager");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;

const queryPath = `${ __dirname }/queries`;

// Allow sql files to have a json5 block at very top of file
const parseJssql = function (input) {
    if (input.indexOf("{") !== 0) {
        return {
            attributes: {},
            sql: input,
        };
    }
    const lines = input.split("\n");
    let jsonString = null;
    let sqlString = null;

    for (let i = 0, l = lines.length; i < l; i++) {
        const line = lines[i];

        if (line === "}") {
            jsonString = lines.slice(0, (i + 1)).join("\n");
            sqlString = lines.slice((i + 1)).join("\n");
            break;
        }
    }
    if (jsonString === null || sqlString === null) {
        throw new Error("Error parsing jssql file");
    }

    const attributes = json5.parse(jsonString);

    return {
        attributes,
        sql: sqlString,
    };
};

const generatePostQueryFilter = function (attributes) {
    if (attributes.returns === "one") {
        return (rows => {
            const row = rows[0];
            if (row) {
                return row[Object.keys(row)[0]];
            }
        });

    } else if (attributes.returns === "row") {
        return (rows => rows[0]);

    } else if (attributes.returns === "column") {
        return (rows => rows.map(row => row[Object.keys(row)[0]]));

    } else {
        return (rows => rows);
    }
};

const queryFunctions = {};
for (let filename of readDirSync(queryPath)) {
    const pathname = `${ queryPath }/${ filename }`;
    const name = camelize(filename);

    if (filename.endsWith(".sql")) {
        const parsed = parseJssql(readFileSync(pathname, {
            encoding: "utf8",
        }));
        const text = parsed.sql;

        const filterRows = generatePostQueryFilter(parsed.attributes);

        queryFunctions[name] = function (client, values) {
            return client.query({ name, text, values })
            .then(filterRows)
            ;
        };
    }

    if (filename.endsWith(".js")) {
        const jsQuery = require(pathname);
        const filterRows = generatePostQueryFilter(jsQuery.attributes);

        if (jsQuery.freeform) {
            queryFunctions[name] = function (name, client, items) {
                return jsQuery.run(client, items);
            };
        } else {
            queryFunctions[name] = function (client, items) {
                const resources = {
                    name,
                    pm: makeParameterManager(),
                };

                return Promise.resolve()
                .then(() => client.query(jsQuery.run(resources, items)))
                .then(filterRows)
                ;
            };
        }
    }
}

module.exports = {
    queryFunctions,
    prepareFor: function (client) {
        const retval = {};
        for (let name in Object.keys(queryFunctions)) {
            const queryFunction = queryFunctions[name];

            retval[name] = function (...args) {
                return queryFunction(client, args);
            };
        }

        return retval;
    },
};
