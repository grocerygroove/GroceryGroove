{
    namedParameters: {
        enable: true,
    },
}

SELECT DISTINCT name
FROM categories
WHERE COALESCE(household_id, :householdId) = :householdId
ORDER BY name
