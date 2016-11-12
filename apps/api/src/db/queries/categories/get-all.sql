{
    namedParameters: true,
}
WITH my_categories AS (
    SELECT category_id, name
    FROM categories
    WHERE COALESCE(household_id, :householdId:) = :householdId:
)

SELECT DISTINCT ON (name)
    *
FROM my_categories
ORDER BY name, category_id NULLS LAST
