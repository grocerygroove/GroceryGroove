{
    errorStateToExceptionMap: {
        23505: require("../../../errors/duplicate-name-error"),
    },

    namedParameters: {
        enabled: true,
    },

    returns: "one",
}

INSERT INTO items (household_id, name, description)
SELECT :householdId, :name, :description

RETURNING item_id 
