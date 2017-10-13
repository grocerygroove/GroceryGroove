{

  namedParameters: {
      enabled: true,
  },

  errorStateToExceptionMap: {
    "23503": (error) => {
      if (error.constraint == "grocery_list_items_quantity_type_id_fkey")
        return require('../../../../errors/invalid-quantity-type-error');
    },
  },

  returns: "one",
}
WITH users_households as (
  select household_id
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
  :quantityTypeId, 
  :quantity, 
  :userId
FROM approved_grocery_list agl
  INNER JOIN category_items_sub cis
    ON agl.user_id = cis.user_id
RETURNING grocery_list_item_id;
