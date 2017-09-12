{
  namedParameters: {
    enabled: true,
  },

  returns: "one",
}
--Used to authenticate a user by email and password
SELECT user_id
FROM users
WHERE email = :email
AND password = crypt(:password, password)
AND activated = true
