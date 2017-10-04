{
    errorStateToExceptionMap: {
        23505: require("../../../errors/duplicate-name-error"),
    },

    namedParameters: {
        enabled: true,
    },

    returns: "one",
}

INSERT INTO items (household_id, name)
SELECT :householdId, :name

RETURNING item_id 
