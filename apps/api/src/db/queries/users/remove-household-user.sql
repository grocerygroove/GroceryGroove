{
  namedParameters: {
    enabled: true,
  },

  returns: "one",
}
WITH approved_users AS (
    SELECT :userIdToDelete AS approved_id
    UNION
    SELECT household_admin AS approved_id
    FROM households
    WHERE household_id = :householdId
), deleted AS (
    DELETE FROM households_users
    WHERE user_id = :userIdToDelete
        AND household_id = :householdId
        AND EXISTS (SELECT approved_id
                    FROM approved_users
                    WHERE approved_id = :userId)
    RETURNING *
)
SELECT COUNT(*) as deleted_count
FROM deleted
