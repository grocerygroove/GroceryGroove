SELECT
    user_id,
    COALESCE(email, device_identifier) AS identifier,
FROM household_users
    INNER JOIN users
        ON users.user_id = household_users.user_id
WHERE household_users.household_id = $1
