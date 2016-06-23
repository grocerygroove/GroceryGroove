{
    returns: "one",
}


WITH household_id AS (
    SELECT household_id
    FROM users
    WHERE email = $1
), inserted_id AS (
    INSERT INTO grocery_lists (household_id, name, created_by_email)
    SELECT                     household_id, $2,   $1
    FROM household_id
    RETURNING grocery_list_id
), grocery_list_access_insert AS (
    INSERT INTO grocery_lists_access_log (grocery_list_id, household_id, access_time)
    SELECT grocery_list_id, hi.household_id, CURRENT_TIMESTAMP
    FROM inserted_id ii
    CROSS JOIN household_id hi
)
SELECT grocery_list_id
FROM inserted_id;
