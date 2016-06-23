WITH household_id AS (
    SELECT household_id
    FROM users
    WHERE email = $1
)
SELECT grocery_list_id, name, total_estimated_cost
FROM grocery_lists
WHERE grocery_lists.household_id = household_id
ORDER BY last_active_at DESC