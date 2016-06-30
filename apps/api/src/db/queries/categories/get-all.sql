WITH my_categories AS (
    SELECT category_id, name
    FROM categories
    WHERE COALESCE(household_id, $1) = $1
)

SELECT DISTINCT ON (name)
    *
FROM my_categories
ORDER BY name, category_id NULLS LAST
