const camelize = require("change-case").camelCase;
const collapse = require("./util/collapse");
const isDirectorySync = require("./util/is-directory-sync");
const jssql = require("./util/jssql");
const readDirSync = require("fs").readdirSync;
const stripExtension = require("./util/strip-extension");

const execute = function (executor, preprocessors, postprocessors, queryArgs) {
    for (const runPreprocess of preprocessors) {
        queryArgs = runPreprocess(queryArgs);
    }

    queryArgs = Object.assign({}, queryArgs, {
        result: executor(queryArgs),
    });

    for (const runPostprocess of postprocessors) {
        queryArgs = runPostprocess(queryArgs);
    }

    return queryArgs.result;
};

const createQueryRunFunction = function ({
    attributes,
    executor,
    generateInterface,
    name,
    pathname,
    postprocessors,
    preprocessors,
    sql,
}) {
    const queryRun = execute.bind(null,
        executor,
        preprocessors,
        postprocessors
    );

    const queryArgs = {
        attributes,
        name,
        pathname,
        sql,
    };

    const retval = generateInterface(queryRun, queryArgs);
    Object.defineProperty(retval, "name", {
        value: `query:${ pathname }`,
    });
    return retval;
};

module.exports = function createQueriesFromDirectorySync (parents, path, opts) {
    const retval = {};
    const store = (name, item) => collapse(retval, name, item);

    for (const filename of readDirSync(path)) {
        const pathname = `${ path }/${ filename }`;

        if (isDirectorySync(pathname)) {
            const name = camelize(filename);
            store(name, createQueriesFromDirectorySync(parents.concat(filename), pathname, opts))

        } else {
            const name = camelize(stripExtension(filename));

            const queryName = parents.concat(stripExtension(filename)).join("/");

            if (!filename.startsWith(".") && filename.endsWith(".sql")) {
                const { attributes, sql } = jssql.parseFileSync(pathname);

                store(name, createQueryRunFunction({
                    attributes,
                    executor: opts.executor,
                    generateInterface: opts.generateInterface,
                    name: queryName,
                    pathname,
                    postprocessors: opts.postprocessors,
                    preprocessors: opts.preprocessors,
                    sql
                }));

            } else if (!filename.startsWith(".") && filename.endsWith(".js")) {
                throw new Error("Not impl, look in git history for old version");

            }
        }
    }

    return retval;
};
