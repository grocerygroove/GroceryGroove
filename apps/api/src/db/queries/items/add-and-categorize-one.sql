{
    returns: "one",
    errorHandling: {
        states: {
            23505: require("../../../errors/duplicate-name-error"),
        },
    },
}
WITH item AS (
    INSERT INTO items (household_id, name, description)
    VALUES ($1, $2, $3)
    RETURNING item_id
), category AS (
    SELECT category_id
    FROM categories
    WHERE category_id = $4
)
INSERT INTO category_items (category_id, item_id)
SELECT category_id, item_id
FROM category, item
RETURNING item_id
