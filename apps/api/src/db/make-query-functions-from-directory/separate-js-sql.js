/**
 * `JSSQL` files are sql files that have a block of attributes at the top of
 * the file. This looks like JSON but it's acually a javascript object that is
 * executed as if it were a javascript object, so function definitions are
 * allowed along with regexps, etc etc.  First character of the first line must
 * be `{`, and the matching `}` must also be the first character of its own
 * line.
 */

module.exports = function separateJsSql (jsSqlString) {
    if (jsSqlString.indexOf("{") !== 0) {
        return {
            js: "{}",
            sql: jsSqlString,
        };
    }


    const lines = jsSqlString.split("\n");
    let jsString = null;
    let sqlString = null;

    for (let i = 0, l = lines.length; i < l; i++) {
        const line = lines[i];

        if (line === "}") {
            jsString = lines.slice(0, (i + 1)).join("\n");
            sqlString = lines.slice((i + 1)).join("\n");
            break;
        }
    }
    if (jsString === null || sqlString === null) {
        throw new Error("Error parsing jssql file");
    }

    return {
        js: jsString,
        sql: sqlString,
    };
};
