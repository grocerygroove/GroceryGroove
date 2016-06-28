WITH users_lookup AS (
    SELECT household_id
    FROM users
    WHERE email = $1
)

SELECT
    gl.grocery_list_id,
    gl.created_by_email,
    gl.name,
    gl.created_at,
    gl.completed_at,
    MAX(glal.access_time) AS last_touched
FROM       users_lookup
INNER JOIN grocery_lists            gl   ON (gl.household_id      = users_lookup.household_id)
INNER JOIN grocery_lists_access_log glal ON (glal.grocery_list_id = gl.grocery_list_id)
GROUP BY glal.grocery_list_id, gl.name, gl.total_estimated_cost
ORDER BY MAX(glal.access_time)
