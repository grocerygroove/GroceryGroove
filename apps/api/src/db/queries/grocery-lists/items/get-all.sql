{
  namedParameters: {
    enabled: true,
  },

  returns : "rows",
}
WITH users_households as (
  SELECT household_id
  FROM households_users
  WHERE user_id = :userId
), approved_grocery_list AS (
  SELECT grocery_list_id, :userId as user_id
  FROM grocery_lists gl
    INNER JOIN users_households uh
      ON gl.household_id = uh.household_id
  WHERE grocery_list_id = :groceryListId
)
SELECT
  --Item
  i.item_id,
  i.name as item_name, 

  --Category
  c.category_id,
  c.name as category_name, 

  --Quantity Type
  qt.quantity_type_id,
  qt.singular_name,
  qt.plural_name,
  qt.singular_abbreviation,
  qt.plural_abbreviation,
  
  gli.quantity,
  gli.checked,

  --Added by User
  u.user_id as added_by_id,
  u.nickname as added_by_nickname
FROM grocery_list_items gli
  INNER JOIN approved_grocery_list agl
    ON gli.grocery_list_id = agl.grocery_list_id
  INNER JOIN items i
    ON gli.item_id = i.item_id
  INNER JOIN categories c
    ON gli.category_id = c.category_id
  INNER JOIN quantity_types qt
    ON gli.quantity_type_id = qt.quantity_type_id
  INNER JOIN users u
    ON gli.added_by_id = u.user_id
 ORDER BY gli.grocery_list_item_id
