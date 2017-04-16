module.exports = () => function customizeLogger (transactionArgs) {
    return Object.assign({}, transactionArgs, {
        logger: transactionArgs.logger.child({
            "transaction_name": transactionArgs.name,
        }),
    });
};
