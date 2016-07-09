{
    returns: "one",
}

SELECT user_id
FROM users
WHERE device_identifier = $1;


