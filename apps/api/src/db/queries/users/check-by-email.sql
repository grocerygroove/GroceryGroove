{
    returns: "one",
}

SELECT TRUE
FROM users
WHERE email = $1
AND password = crypt($2, password);
AND activated = true
