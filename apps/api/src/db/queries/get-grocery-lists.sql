WITH household_id AS (
    SELECT household_id
    FROM users
    WHERE email = $1
), top_grocery_lists_access_times AS (
   SELECT *
   FROM 
   (
    SELECT *,
            ROW_NUMBER() OVER (PARTITION BY grocery_list_id ORDER BY access_time DESC) AS rn
    FROM grocery_lists_access_log glal
        INNER JOIN household_id hi ON glal.household_id = hi.household_id
   ) x
   WHERE rn = 1
)
SELECT gl.grocery_list_id, gl.name, gl.total_estimated_cost
FROM grocery_lists gl
    INNER JOIN top_grocery_lists_access_times tglat 
        ON gl.grocery_list_id = tglat.grocery_list_id
ORDER BY tglat.access_time DESC