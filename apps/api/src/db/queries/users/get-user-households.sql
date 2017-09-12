{
  namedParameters: {
    enabled: true,
  },

  returns: "column",
}
SELECT household_id
FROM households_users
WHERE user_id = :userId
ORDER BY household_id
