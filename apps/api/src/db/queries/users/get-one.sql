{
  namedParameters: {
    enabled: true,
  },

  returns: "row",
}
SELECT
    user_id,
    email,
    device_identifier,
    phone_number,
    primary_household_id,
    invited_by_id
FROM users
WHERE user_id = :userId
