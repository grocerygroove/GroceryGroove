WITH users_lookup AS (
    SELECT household_id
    FROM users
    WHERE email = $1
), my_categories AS (
    SELECT category_id, name
    FROM categories
    WHERE COALESCE(household_id, users_lookup) = users_lookup
)

SELECT DISTINCT ON (name)
    *
FROM my_categories
ORDER BY name, category_id NULLS LAST
