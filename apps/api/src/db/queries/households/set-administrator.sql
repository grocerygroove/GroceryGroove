{
    namedParameters: {
      enabled: true,
    },

    returns: "one",
}
WITH approved_users AS (
    SELECT household_admin, household_id
    FROM households
    WHERE household_id = :householdId
        AND household_admin = :userId
), available_users AS (
    SELECT hu.user_id, hu.household_id
    FROM households_users hu
    WHERE hu.household_id = :householdId
      AND hu.user_id <> :userId 
), updated AS (
    UPDATE households h
    SET household_admin = avu.user_id
    FROM approved_users au
        INNER JOIN available_users avu
            ON avu.household_id = au.household_id
                AND avu.user_id = :userToPromote
    WHERE h.household_id = au.household_id
    RETURNING *
)
SELECT COUNT(*) as updated_count
FROM updated
