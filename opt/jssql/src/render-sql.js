"use strict";
const argumentToString = function(arg) {
    if (0) {
    } else if (arg.type) {
        return `${ arg.name } ${ arg.type }`;
    } else if (arg.typealias) {
        return `${ arg.name } ${ arg.typealias }%TYPE`;
    } else {
        throw new Error(`neither type nor typealias set for ${ arg.name }`);
    }
};

const returnsToString = function (returns) {
    if (typeof returns === "undefined") {
        return "VOID";
    } else {
        return returns;
    }
};

const generateBody = function (attributes, innerBody) {
    if (0) {
    } else if (attributes.language === "plv8") {
        return innerBody;
    } else if (attributes.language === "plpgsql") {
        return `
            DECLARE
                ${ (attributes.declare || []).map(argumentToString).map(a => a+";").join("\n") }
            BEGIN
                ${ innerBody }
            END;
        `;
    } else {
        throw new Error(`Bad lang: ${ attributes.language }`);
    }
};
const volatileToString = function (volatile) {
    if (volatile) {
        return "VOLATILE";
    } else {
        return "";
    }
};
const strictToString = function (strict) {
    if (strict) {
        return "STRICT";
    } else {
        return "";
    }
};

const renderSql = function (name, attributes, body) {
    return `
        CREATE OR REPLACE FUNCTION ${ name }(
            ${ attributes.arguments.map(argumentToString).join(",\n") }
        ) RETURNS ${ returnsToString(attributes.returns) }
        AS $$
            ${ generateBody(attributes, body) }
        $$
        LANGUAGE ${ attributes.language }
        ${ volatileToString(attributes) }
        ${ strictToString(attributes) }
    `;
};

module.exports = renderSql;
