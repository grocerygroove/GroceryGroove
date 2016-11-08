{
    returns: "none",
}

WITH insert_household_user AS (
    INSERT INTO households_users(household_id, user_id)
    VALUES($1, $2)
)

UPDATE households SET
    created_by_id = $2,
    household_admin = $2
WHERE household_id = $1
