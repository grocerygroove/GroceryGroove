{
  namedParameters: {
    enabled: true,
  },

  returns: "rows",
}
WITH authed_household AS (
  SELECT household_id
  FROM households_users
  WHERE user_id = :userId
    AND household_id = :householdId
)
SELECT
    hu.user_id,
    COALESCE(email, device_identifier) AS identifier
FROM households_users hu
  INNER JOIN authed_household au
    ON hu.household_id = au.household_id
  INNER JOIN users u
    ON hu.user_id = u.user_id
ORDER BY hu.user_id
