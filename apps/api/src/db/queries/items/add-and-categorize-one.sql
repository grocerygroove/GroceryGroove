{
    errorStateToExceptionMap: {
        23505: require("../../../errors/duplicate-name-error"),
    },

    namedParameters: {
        enabled: true,
    },

    returns: "one",
}

WITH item_insert AS (
    INSERT INTO items (household_id, name, description)
    SELECT :householdId, :name, :description
    WHERE NOT EXISTS
        (
            SELECT 1
            FROM items
            WHERE household_id = :householdId
                AND name = :name
        )
), item AS (
    SELECT item_id
    FROM items
    WHERE household_id = :householdId
        AND name = :name
) category AS (
    SELECT category_id
    FROM categories
    WHERE category_id = :categoryId
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
