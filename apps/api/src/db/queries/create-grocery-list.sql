{
    returns: "one",
}

WITH household_id AS (
    SELECT household_id
    FROM users
    WHERE email = $1
)

INSERT INTO grocery_lists (household_id, name, created_by_email)
SELECT                     household_id, $2,   $1
FROM household_id
RETURNING grocery_list_id
