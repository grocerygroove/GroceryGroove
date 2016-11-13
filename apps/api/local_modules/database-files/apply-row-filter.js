const InvalidRowFilterError = require("./errors/invalid-row-filter-error");

const rowFilters = {
    column: function (rows) {
        let firstKey = null;
        return rows.map(row => row[firstKey || (firstKey = Object.keys(row)[0])]);
    },

    one: function (rows) {
        const row = rows[0];
        if (row) {
            return row[Object.keys(row)[0]];
        } else {
            return void(0);
        }
    },

    row: function (rows) {
        return rows[0];
    },

    none: function (rows) {
        return;
    },
};

module.exports = function applyRowFilter (type, rows) {
    if (0) {
    } else if (type && rowFilters[type]) {
        return rowFilters[type](rows);
    } else if (type && (!rowFilters[type])) {
        throw new InvalidRowFilterError(type);
    } else {
        return rows;
    }
};
