module.exports = function column (rows) {
    return rows.map(row => row[Object.keys(row)[0]]);
};
