const rowFilter = {
    column: require("./row-filters/column"),
    one: require("./row-filters/one"),
    row: require("./row-filters/row"),
};

module.exports = function getRowFilter (type) {
    return rowFilter[type] || (rows => rows);
};
