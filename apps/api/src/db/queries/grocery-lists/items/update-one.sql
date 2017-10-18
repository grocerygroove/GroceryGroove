{

  namedParameters: {
      enabled: true,
  },

  errorStateToExceptionMap: {
    "23503": (error) => {
      if (error.constraint == "grocery_list_items_quantity_type_id_fkey")
        return require('../../../../errors/invalid-quantity-type-error');
      else if(error.constraint == "grocery_list_items_item_id_fkey")
        return require('../../../../errors/invalid-item-error');
    },
  },

  params: [
    "householdId",
    "userId",
    "groceryListId",
    "groceryListItemId",
    "itemId",
    "categoryId",
    "quantityTypeId",
    "quantity",
    "checked",
    "purchasedAt",
    "purchasedById",
    "unitCost",
  ],

  returns: "one",
}
WITH users_households as (
  select household_id, user_id
  FROM households_users
  WHERE user_id = :userId
), approved_grocery_list AS (
  SELECT grocery_list_id, :userId as user_id
  FROM grocery_lists gl
    INNER JOIN users_households uh
      ON gl.household_id = uh.household_id
  WHERE grocery_list_id = :groceryListId
)
UPDATE grocery_list_items gli
SET item_id = COALESCE(:itemId, gli.item_id),
    category_id = COALESCE(:categoryId, gli.category_id),
    quantity_type_id = COALESCE(:quantityTypeId, gli.quantity_type_id),
    quantity = COALESCE(:quantity, gli.quantity),
    checked = COALESCE(:checked, gli.checked),
    purchased_at = COALESCE(:purchasedAt, gli.purchased_at),
    purchased_by_id = COALESCE(:purchasedById, gli.purchased_by_id),
    unit_cost = COALESCE(:unitCost, gli.unit_cost)
FROM approved_grocery_list agl
  INNER JOIN users_households uh
    ON uh.user_id = agl.user_id
WHERE gli.grocery_list_id = agl.grocery_list_id
  AND grocery_list_item_id = :groceryListItemId
RETURNING grocery_list_item_id;
