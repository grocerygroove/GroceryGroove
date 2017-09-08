const camelize = require("change-case").camelCase;
const collapse = require("./util/collapse");
const isDirectorySync = require("./util/is-directory-sync");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const stripExtension = require("./util/strip-extension");

const execute = function (executor, preprocessors, postprocessors, transactionArgs) {
    for (const runPreprocess of preprocessors) {
        transactionArgs = runPreprocess(transactionArgs);
    }

    transactionArgs = Object.assign({}, transactionArgs, {
        result: executor(transactionArgs),
    });

    for (const runPostprocess of postprocessors) {
        transactionArgs = runPostprocess(transactionArgs);
    }

    return transactionArgs.result;
};

const createTransactionRunFunction = function ({
    attributes,
    executor,
    generateInterface,
    name,
    pathname,
    preprocessors,
    postprocessors,
    transactionFn,
}) {
    const transactionRun = execute.bind(null,
        executor,
        preprocessors,
        postprocessors
    );

    const transactionArgs = {
        attributes,
        name,
        pathname,
        transactionFn,
    };

    const retval = generateInterface(transactionRun, transactionArgs);
    Object.defineProperty(retval, "name", {
        value: `transaction:${ pathname }`,
    });
    return retval;
};

module.exports = function createTransactionsFromDirectorySync (parents, path, opts) {
    const retval = {};
    const store = (name, item) => collapse(retval, name, item);

    for (const filename of readDirSync(path)) {
        const pathname = `${ path }/${ filename }`;

        if (isDirectorySync(pathname)) {
            const name = camelize(filename);
            store(name, createTransactionsFromDirectorySync(parents.concat(filename), pathname, opts))

        } else {
            const name = camelize(stripExtension(filename));
            const transactionName = parents.concat(stripExtension(filename)).join("/");

            if (!filename.startsWith(".") && filename.endsWith(".js")) {
                const transactionFn = require(pathname);

                store(name, createTransactionRunFunction({
                    attributes: {},
                    executor: opts.executor,
                    generateInterface: opts.generateInterface,
                    name: transactionName,
                    postprocessors: opts.postprocessors,
                    preprocessors: opts.preprocessors,
                    transactionFn,
                }));
            }
        }
    }

    return retval;
};
