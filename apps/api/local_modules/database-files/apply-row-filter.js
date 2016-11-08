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
};

module.exports = function applyRowFilter (type, rows) {
    if (type) {
        if (rowFilters[type]) {
            return rowFilters[type](rows);
        } else {
            throw new InvalidRowFilterError(type);
        }
    } else {
        return rows;
    }
};
