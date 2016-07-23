UPDATE users
SET email = $2, password = $3
WHERE user_id = $1
