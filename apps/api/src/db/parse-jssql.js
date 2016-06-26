/**
 * `JSSQL` files are sql files that have extra metadata at the top of the file
 * in json5 format. First character of the first line must be `{`, and the
 * matching `}` must also be the first character of its own line.
 */

const json5 = require("json5");

module.exports = function parseJssql (jssqlString) {
    if (jssqlString.indexOf("{") !== 0) {
        return {
            attributes: {},
            sql: jssqlString,
        };
    }
    const lines = jssqlString.split("\n");
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
