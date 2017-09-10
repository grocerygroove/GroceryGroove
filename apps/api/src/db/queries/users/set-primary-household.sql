{
  namedParameters: {
    enabled: true,
  },

  returns: "none",
}
WITH
  users_households AS (
    SELECT hu.household_id, hu.user_id
    FROM households_users hu
      INNER JOIN households h
        ON hu.household_id = h.household_id
      INNER JOIN users u
        ON hu.user_id = u.user_id
    WHERE hu.household_id = :householdId
      AND hu.user_id = :userId
  )
UPDATE users SET
    primary_household_id = users_households.household_id
FROM users u
  INNER JOIN users_households
    ON u.user_id = users_households.user_id
