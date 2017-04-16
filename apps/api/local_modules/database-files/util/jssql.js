const readFileSync        = require("fs").readFileSync;
const requireStringAsFile = require("require-string-as-file");

const types = {
    "json-ish": {
        jsStart:  "{",
        sqlStart: "}"

        jsRequire = (pathname, jsString) => requireStringAsFile(pathname, `
            module.exports = ${ jsString };
        `),
    },

    "labels":   {
        jsStart: "JS:",
        sqlStart: "SQL:",

        jsRequire: (pathname, jsString) => requireStringAsFile(pathname, jsString),
    },
};

const determineType = function determineType (contents) {
    for (const type of Object.keys(types)) {
        const startingDelimeter = types[type];

        if (contents.startsWith(startingDelimeter)) {
            return type;
        }
    }
};

module.exports = {
    parse: function parse (pathname, contents) {
        const type = determineType(contents);

        if (type) {
            const strings = {
                js:  null,
                sql: null,
            };

            const lines = contents.split("\n");
            for (let i = 0, l = lines.length; i < l; i++) {
                const line = lines[i];

                if (line === types[type].sqlStart) {
                    strings.js  = lines.slice(0, (i + 1)).join("\n");
                    strings.sql = lines.slice((i + 1)).join("\n");
                    break;
                }
            }

            if (strings.js === null || strings.sql === null) {
                throw new Error("Error parsing jssql file");
            }

            return {
                js: types[type].jsRequire(pathname, strings.js),
                sql: strings.sql,
            };

        } else {
            return {
                js: {},
                sql: contents,
            };
        }
    },

    parseFileSync: function parseFileSync (pathname) {
        return module.exports.parse(pathname, readFileSync(pathname, {
            encoding: "UTF-8",
        }));
    },
};
