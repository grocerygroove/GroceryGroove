{
    returns: "one",

    namedParameters: {
        enabled: true,
    },
}

WITH
    users_housholds AS (
    SELECT household_id
    FROM households_users
    WHERE user_id = :userId
)
INSERT INTO grocery_list_items (grocery_list_id, item_id, quantity_type_id, quantity, added_by_id)
SELECT gl.grocery_list_id, it.item_id, qt.quantity_type_id, :quantity, :userId
FROM grocery_lists gl
    INNER JOIN users_housholds uh ON uh.household_id = gl.household_id
        AND gl.grocery_list_id = :groceryListId
    INNER JOIN items it ON it.item_id = :itemId
        AND it.household_id = uh.household_id
    INNER JOIN quantity_types qt ON qt.quantity_type_id = :quantityTypeId
RETURNING grocery_list_item_id
