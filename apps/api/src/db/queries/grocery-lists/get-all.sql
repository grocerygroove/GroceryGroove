{
    namedParameters: {
        enabled: true,
    },

    returns: "rows",
}

WITH
    users_housholds AS (
    SELECT household_id
    FROM households_users
    WHERE user_id = :userId
)
SELECT
    gl.grocery_list_id,
    gl.created_by_id,
    gl.name,
    gl.created_at,
    gl.completed_at,
    MAX(glal.access_time) AS last_touched
FROM       grocery_lists            gl
LEFT JOIN grocery_list_access_logs glal 
  ON (glal.grocery_list_id = gl.grocery_list_id)
INNER JOIN users_housholds uh 
  ON uh.household_id = gl.household_id 
    AND gl.household_id = :householdId
GROUP BY gl.grocery_list_id,
         gl.created_by_id,
         gl.name,
         gl.created_at,
         gl.completed_at
ORDER BY MAX(glal.access_time) DESC
