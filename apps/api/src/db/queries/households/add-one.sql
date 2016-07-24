{
    returns: "one",
}
WITH
    my_household AS (
        INSERT INTO households (name)
        VALUES ($2)
        returning household_id
    ),
    my_household_user AS (
        INSERT INTO households_users(household_id, user_id)
        SELECT household_id, $1
        FROM my_household
        RETURNING household_id, user_id
    )
UPDATE households SET
    created_by_id = my_household_user.user_id,
    household_admin = my_household_user.user_id
FROM my_household_user
RETURNING households.household_id
