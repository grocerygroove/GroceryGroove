SELECT household_id
FROM households_users
WHERE user_id = $1
ORDER BY household_id
