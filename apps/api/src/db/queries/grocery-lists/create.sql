{
    returns: "one",
    errorstates: [
        {
            state   : "23502",
            message : "User doesn't have permission to create grocery list for this household.",
        },
        {
            state   : "23505",
            message : "Grocery list name must be unique.",
        },
    ],
}

WITH users_permission AS (
    SELECT household_id, user_id
    FROM households_users
    WHERE user_id = $1
        AND household_id = $3
)
INSERT INTO grocery_lists(household_id, name, created_by_id)
SELECT household_id, $2, user_id
FROM users_permission
RETURNING grocery_list_id;
