{
  namedParameters: {
    enabled: true,
  },

  returns: "one",
}

SELECT user_id
FROM users
WHERE device_identifier = :deviceIdentifier
  --AND activated = true
