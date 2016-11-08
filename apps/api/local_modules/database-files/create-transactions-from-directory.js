const camelize = require("change-case").camelCase;
const collapse = require("./collapse");
const concat = require("./concat");
const isDirectory = require("./is-directory-sync");
const readDirSync = require("fs").readdirSync;
const readFileSync = require("fs").readFileSync;
const rf = require("./rename-function");
const stripExtension = require("./strip-extension");

module.exports = function createTransactionsFromDirectory (parentFilenames, path) {
    if (arguments.length === 1) {
        return createTransactionsFromDirectory([], parentFilenames);
    }

    const retval = {};
    const assign = (name, item) => collapse(retval, name, item);

    for (const filename of readDirSync(path)) {
        const pathname = `${ path }/${ filename }`;

        if (isDirectory(pathname)) {
            const filenames = concat(parentFilenames, filename);
            const name = camelize(filename);
            const transactions = createTransactionsFromDirectory(filenames, pathname);

            assign(name, transactions);
        } else {
            const name = camelize(stripExtension(filename));
            const transactionName = concat(parentFilenames, stripExtension(filename)).join("/");
            const functionName = transactionName.split("/").join("_");

            if (!filename.startsWith(".") && filename.endsWith(".js")) {
                const contents = require(pathname);
                const attributes = (
                    (typeof contents === "function")
                    ? ({
                        transaction: contents,
                    })
                    : contents
                );

                assign(name, rf(functionName, function (db, logger, items) {
                    return db.transaction(client => {
                        const resources = {
                            client,
                            logger: logger.child({
                                "transaction_name": transactionName,
                            }),
                        };

                        return Promise.resolve()
                        .then(() => attributes.transaction(resources, items))
                        .then(
                            rows => applyRowFilter(attributes.returns, rows),
                            error => Promise.reject(convertSqlError(pathname, attributes.errorHandling, error) || error)
                        );
                    });
                }));
            }
        }
    }

    return retval;
};
