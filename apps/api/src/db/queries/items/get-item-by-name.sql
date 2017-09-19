{
    namedParameters: {
        enabled: true,
    },

    returns: "one",
}
SELECT item_id
FROM items
WHERE household_id = :householdId
  AND name = :name
