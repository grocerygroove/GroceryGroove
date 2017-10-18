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
  :itemId, 
  :categoryId,
  :quantityTypeId, 
  :quantity, 
  :userId
FROM approved_grocery_list agl
RETURNING grocery_list_item_id;
