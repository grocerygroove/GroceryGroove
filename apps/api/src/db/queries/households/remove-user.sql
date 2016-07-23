{
    returns: "one",
}
WITH approved_users AS (
    SELECT $2 AS approved_id
    UNION
    SELECT household_admin AS approved_id
    FROM hosueholds
    WHERE hosuehold_id = $3
), deleted AS (
    DELETE FROM households_users
    WHERE user_id = $2
        AND EXISTS (SELECT approved_id
                    FROM approved_users
                    WHERE approved_id = $1)
)
SELECT COUNT(*) as deleted_count
FROM deleted
