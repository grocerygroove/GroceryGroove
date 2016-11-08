module.exports = function extractNamedParameters (sql) {
    const regex = /(:([^:]+):)/g;
    const retval = {
        sql: sql,
        parameterNames: [],
    };

    const parameterNameLookup = {};


    let res;
    while (res = regex.exec(sql)) {
        const parameterName = res[2];
        if (parameterNameLookup[parameterName]) {
            continue;
        }

        parameterNameLookup[parameterName] = true;
        retval.parameterNames.push(parameterName);

        retval.sql = retval.sql
            .split(`:${ parameterName }:`)
            .join(`$${ retval.parameterNames.length }`)
        ;
    }

    return retval;
};
