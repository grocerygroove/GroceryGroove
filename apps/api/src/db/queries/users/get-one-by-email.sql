{
    returns: "row",
}

SELECT
    user_id,
    email,
    phone_number,
    default_household_id,
    invited_by_id
FROM users
WHERE email = $1
  AND activated = true
