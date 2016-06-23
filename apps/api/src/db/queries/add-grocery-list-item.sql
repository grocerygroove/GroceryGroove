--params
-- 1: item name
-- 2: category_name
-- 3: household_id
-- 4: grocery_list_id
-- 5: quantity_type_name
-- 6: quantity
-- 7: added_by_email
with existingItem as (
    SELECT TRUE
    FROM items
    where name = $1 
), newItem as (
    insert INTO items (name)
    select $1
    where existingItem IS NULL
), existingCategoryItem as (
    SELECT TRUE
    FROM category_items
    WHERE item_name = $1
        AND category_name = $2
        AND household_id = $3
), newCategoryItem as (
    INSERT INTO category_items (item_name, category_name, household_id)
    SELECT $1, $2, $3
    WHERE existingCategoryItem IS NULL
), existingListItem as (
    SELECT TRUE
    FROM grocery_list_items
    WHERE grocery_list_id = $4
        AND item_name = $1
) 

--If the item already exists on the list, increment the quantity?
IF existingListItem IS NOT NULL THEN
    UPDATE grocery_list_items
    SET quantity = quantity + 1
    WHERE grocery_list_id = $4
        AND item_name = $1 
ELSE
    INSERT INTO grocery_list_items (grocery_list_id, household_id, item_name, quantity_type_name, quantity, added_by_email)
    VALUES                         ($4,              $3,           $1,        $5,                 $6,       $7)
END IF;



