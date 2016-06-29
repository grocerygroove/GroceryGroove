SELECT name
FROM categories
WHERE COALESCE(household_id, $1) = $1
ORDER BY name
