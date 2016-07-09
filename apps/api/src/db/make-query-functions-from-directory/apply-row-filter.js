const rowFilters = {
    column: require("./row-filters/column"),
    noop: require("./row-filters/noop"),
    one: require("./row-filters/one"),
    row: require("./row-filters/row"),
};

module.exports = function applyRowFilter (type, rows) {
    const rowFilter = rowFilters[type] || rowFilters["noop"];

    return rowFilter(rows);
};
