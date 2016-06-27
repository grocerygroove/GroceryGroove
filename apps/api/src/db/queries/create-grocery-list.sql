{
    returns: "one",
}

WITH users_lookup AS (
    SELECT household_id
    FROM users
    WHERE email = $1
)

INSERT INTO grocery_lists (household_id, name, created_by_email)
SELECT                     household_id, $2,   $1
FROM users_lookup
RETURNING grocery_list_id
