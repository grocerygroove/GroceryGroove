SELECT
    gl.grocery_list_id,
    gl.created_by_email,
    gl.name,
    gl.created_at,
    gl.completed_at,
    MAX(glal.access_time) AS last_touched
FROM       grocery_lists            gl
INNER JOIN grocery_list_access_logs glal ON (glal.grocery_list_id = gl.grocery_list_id)
WHERE gl.household_id = $1
GROUP BY gl.grocery_list_id,
         gl.created_by_email,
         gl.name,
         gl.created_at,
         gl.completed_at
ORDER BY MAX(glal.access_time)
