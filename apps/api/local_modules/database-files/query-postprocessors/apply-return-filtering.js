const filters = {
    column: function (result) {
        let firstKey = undefined;

        return result.rows.map(row => {
            if (firstKey === undefined) {
                firstKey = Object.keys(row)[0];
            }

            return row[firstKey];
        });
    },

    one: function (result) {
        const row = result.rows[0];
        if (row) {
            return row[Object.keys(row)[0]];
        } else {
            return undefined;
        }
    },

    row: function (result) {
        return result.rows[0];
    },

    rows: function (result) {
        return result.rows;
    },

    none: function (result) {
        return;
    },
};

module.exports = () => function applyReturnFiltering(queryArgs) {
    const filter = filters[queryArgs.attributes.returns];
    if (filter) {
        return Object.assign({}, queryArgs, {
            result: queryArgs.result.then(filter),
        });
    } else {
        return queryArgs;
    }
};
