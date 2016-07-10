module.exports = function applyDefaults (given, ...defaults) {
    return Object.assign({}, given, ...defaults);
};
