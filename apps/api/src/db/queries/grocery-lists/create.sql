{
    returns: "one",
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
