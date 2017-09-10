{
    returns: "none",

    namedParameters: {
        enabled: true,
    },
}
INSERT INTO households_users(household_id, user_id)
VALUES(:householdId, :userId)
