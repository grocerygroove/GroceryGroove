--params
-- 1: item name
-- 2: category_name
-- 3: household_id
-- 4: grocery_list_id
-- 5: quantity_type_name
-- 6: quantity
-- 7: added_by_email
with item_insert AS(
    INSERT INTO items (name)
    VALUES ($1)
    ON CONFLICT DO NOTHING
), category_item_insert as (
    INSERT INTO category_items (item_name, category_name, household_id)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
), grocery_list_items_insert AS (
    INSERT INTO grocery_list_items (grocery_list_id, household_id, item_name, quantity_type_name, quantity, added_by_email)
    VALUES                         ($4,              $3,           $1,        $5,                 $6,       $7)
)
INSERT INTO grocery_list_access_log (grocery_list_id, household_id, access_time)
VALUES                              ($4,              $3,           CURRENT_TIMESTAMP)