module.exports = function one (rows) {
    const row = rows[0];
    if (row) {
        return row[Object.keys(row)[0]];
    }
};
