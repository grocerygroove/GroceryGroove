module.exports = function joinPaths (...paths) {
    paths = paths
        .map(path => path.replace(/^\//, ''))
        .map(path => path.replace(/\/$/, ''))
        .filter(path => path)
    ;
    return `/${ paths.join("/") }`;
};
