WITH
    my_household AS (
        INSERT INTO households (name)
        VALUES (CONCAT($1::TEXT, '''s Home'))
        RETURNING household_id
    ),
    my_user AS (
        INSERT INTO users (email, password)
        SELECT             $1,    create_hashed_password($2::TEXT)
        FROM my_household
        RETURNING user_id
    ),
    my_household_user AS (
        INSERT INTO households_users(household_id, user_id)
        SELECT household_id, user_id
        FROM my_household, my_user
        RETURNING household_id, user_id
    ),
    my_household_update AS (
        UPDATE households SET
            created_by_id = my_household_user.user_id
        FROM my_household_user
        WHERE my_household_user.household_id = households.household_id
        RETURNING households.household_id, user_id
    )

UPDATE users SET
    primary_household_id = my_household_update.household_id
FROM my_household_update
WHERE users.user_id = my_household_update.user_id
