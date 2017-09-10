{
    returns: "row",

    namedParameters: {
        enabled: true,
    },
}

SELECT
    name,
    COALESCE(email, device_identifier) AS admin

FROM households
INNER JOIN users ON households.household_admin = users.user_id

WHERE household_id = :householdId
