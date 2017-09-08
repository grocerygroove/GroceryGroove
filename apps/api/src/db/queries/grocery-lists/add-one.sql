{
    returns: "one",

    errorStateToExceptionMap: {
      "23505": require("../../../errors/duplicate-name-error"),
    },

    namedParameters: {
        enabled: true,
    },
}

WITH users_permission AS (
    SELECT household_id, user_id
    FROM households_users
    WHERE user_id = :userId
      AND household_id = :householdId
)

INSERT INTO grocery_lists(household_id, name, created_by_id)
SELECT household_id, :groceryListName, user_id
FROM users_permission

RETURNING grocery_list_id
