module.exports = () => function customizeQueryLogger (queryArgs) {
    return Object.assign({}, queryArgs, {
        logger: queryArgs.logger.child({
            "query_name": queryArgs.name,
        }),
    });
};
