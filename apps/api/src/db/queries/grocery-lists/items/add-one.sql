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
), category_items_sub AS (
  SELECT category_id, item_id, :userId as user_id
  FROM category_items
  WHERE category_id = :categoryId
    AND item_id = :itemId
), approved_grocery_list AS (
  SELECT grocery_list_id, :userId as user_id
  FROM grocery_lists gl
    INNER JOIN users_households uh
      ON gl.household_id = uh.household_id
  WHERE grocery_list_id = :groceryListId
), valid_quantity_type AS (
  SELECT quantity_type_id, :userId as user_id
  FROM quantity_types
  WHERE quantity_type_id = :quantityTypeId
    AND household_id IS NULL
      OR household_id IN (
      SELECT household_id
      FROM users_households
    )
)
INSERT INTO grocery_list_items (
  grocery_list_id, 
  item_id, 
  category_id,
  quantity_type_id, 
  quantity, 
  added_by_id)
SELECT 
  agl.grocery_list_id, 
  cis.item_id, 
  cis.category_id,
  vqt.quantity_type_id, 
  :quantity, 
  :userId
FROM approved_grocery_list agl
  INNER JOIN category_items_sub cis
    ON agl.user_id = cis.user_id
  INNER JOIN valid_quantity_type vqt
    ON cis.user_id = vqt.user_id 
RETURNING grocery_list_item_id;
