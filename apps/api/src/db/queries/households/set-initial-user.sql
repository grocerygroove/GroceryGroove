{
    returns: "none",

    namedParameters: {
        enabled: true,
    },
}

WITH insert_household_user AS (
    INSERT INTO households_users(household_id, user_id)
    VALUES(:householdId, :userId)
)

UPDATE households SET
    created_by_id = :userId,
    household_admin = :userId
WHERE household_id = :householdId
