{
    returns: "one",
}
WITH
    users_housholds AS (
    SELECT household_id
    FROM households_users
    WHERE user_id = $2
)
INSERT INTO grocery_list_items (grocery_list_id, item_id, quantity_type_id, quantity, added_by_id)
SELECT gl.grocery_list_id, it.item_id, qt.quantity_type_id, $5, $2
FROM grocery_lists gl
    INNER JOIN users_housholds uh ON uh.household_id = gl.household_id
        AND gl.grocery_list_id = $1
    INNER JOIN items it ON it.item_id = $3
        AND it.household_id = uh.household_id
    INNER JOIN quantity_types qt ON qt.quantity_type_id = $4
RETURNING grocery_list_item_id
