{

  namedParameters: {
      enabled: true,
  },

  returns: "one",
}
WITH users_households AS (
  SELECT household_id
  FROM households_users
  WHERE user_id = :userId
), approved_grocery_lists AS (
  SELECT grocery_list_id
  FROM grocery_lists gl
    INNER JOIN users_households uh
      ON gl.household_id = uh.household_id
  WHERE grocery_list_id = :groceryListId
), delete_grocery_list_item AS (
  DELETE FROM grocery_list_items
  WHERE grocery_list_id IN (
    SELECT grocery_list_id
    FROM approved_grocery_lists
  ) AND item_id = :groceryListItemId
  RETURNING *
)
SELECT COUNT(*) as deleted_count
FROM delete_grocery_list_item
