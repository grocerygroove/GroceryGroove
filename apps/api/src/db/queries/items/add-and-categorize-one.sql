{
    returns: "one",
    errorHandling: {
        states: {
            23505: require("../../../errors/duplicate-name-error"),
        },
    },
}
WITH item_insert AS (
    INSERT INTO items (household_id, name, description)
    SELECT $1, $2, $3
    WHERE NOT EXISTS
        (
            SELECT 1
            FROM items
            WHERE household_id = $1
                AND name = $2
        )
), item AS (
    SELECT item_id
    FROM items
    WHERE household_id = $1
        AND name = $2
) category AS (
    SELECT category_id
    FROM categories
    WHERE category_id = $4
) category_items_insert AS (
    INSERT INTO category_items (category_id, item_id)
    SELECT category_id, item_id
    FROM category, item
    WHERE NOT EXISTS
        (
            SELECT 1
            FROM category_items
            WHERE category_id = category.category_id
                AND item_id = item.item_id
        )
)
SELECT item_id
FROM item
