module.exports = function stripExtension (filename) {
    return filename.split(".").slice(0, -1).join(".");
};
