{
    returns: "row",
}

SELECT email, household_id
FROM users
WHERE email = $1
