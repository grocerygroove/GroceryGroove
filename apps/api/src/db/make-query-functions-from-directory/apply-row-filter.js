const InvalidRowFilterType = require("../../errors/InvalidRowFilterType");

const rowFilters = {
    column: function (rows) {
        return rows.map(row => row[Object.keys(row)[0]]);
    },
    one: function (rows) {
        const row = rows[0];
        if (row) {
            return row[Object.keys(row)[0]];
        }
    },
    row: function (rows) {
        return rows[0];
    };
};
module.exports = function applyRowFilter (type, rows) {
    if (rowFilter[type]) {
        return rowFilters[type](rows);
    } else {
        throw new InvalidRowFilterType(type);
    }
};
