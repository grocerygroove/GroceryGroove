"use strict";
const parse = function (input) {
    const lines = input.split("\n");

    let jsonString = null;
    let sqlString = null;
    for (let i = 0, len = lines.length; i < len; i++) {
        const line = lines[i];

        if (line === "}") {
            jsonString = lines.slice(0, i+1).join("\n");
            sqlString = lines.slice(i+1).join("\n");
            break;
        }
    }
    if (jsonString === null || sqlString === null) {
        throw new Error("should have this by now");
    }

    const attributes = eval(`(${jsonString})`);
    return {
        attributes,
        body: sqlString,
    };
};

module.exports = parse;
