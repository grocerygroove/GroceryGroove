SELECT DISTINCT name
FROM categories
WHERE COALESCE(household_id, $1) = $1
