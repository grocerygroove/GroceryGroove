--params
-- 1: item name
-- 2: category_name
-- 3: household_id
-- 4: grocery_list_id
-- 5: quantity_type_name
-- 6: quantity
-- 7: added_by_email
with existing_item as (
    SELECT TRUE
    FROM items
    where name = $1 
), new_item as (
    insert INTO items (name)
    select $1
    where existing_item IS NULL
), existing_category_item as (
    SELECT TRUE
    FROM category_items
    WHERE item_name = $1
        AND category_name = $2
        AND household_id = $3
), existing_category_item as (
    INSERT INTO category_items (item_name, category_name, household_id)
    SELECT $1, $2, $3
    WHERE existing_category_item IS NULL
)
BEGIN;
INSERT INTO grocery_list_items (grocery_list_id, household_id, item_name, quantity_type_name, quantity, added_by_email)
VALUES                         ($4,              $3,           $1,        $5,                 $6,       $7)

COMMIT;




