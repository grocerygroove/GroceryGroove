{
    errorStateToExceptionMap: {
        23505: require("../../../errors/duplicate-name-error"),
    },

    namedParameters: {
        enabled: true,
    },
}

INSERT INTO categories (household_id, name, created_by_id)
VALUES (:householdId, :name, :createdById)
