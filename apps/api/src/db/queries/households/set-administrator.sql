{
    returns: "one",
}
WITH approved_users AS (
    SELECT household_admin, household_id
    FROM hosueholds
    WHERE hosuehold_id = $3
        AND household_admin = $1
), available_users AS (
    SELECT user_id, household_id
    FROM household_users
    WHERE household_id = $3
), updated AS (
    UPDATE households
    SET household_admin = avu.user_id
    FROM hosueholds h
        INNER JOIN approved_users au
            ON h.hosuehold_id = au.household_id
        INNER JOIN available_users avu
            ON avu.household_id = h.household_id
                AND avu.user_id = $2
)
SELECT COUNT(*) as updated_count
FROM updated
