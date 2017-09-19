{
    namedParameters: {
        enabled: true,
    },

    returns: "none",
}
INSERT INTO category_items (category_id, item_id)
SELECT :categoryId, :itemId
WHERE NOT EXISTS
  (
      SELECT 1
      FROM category_items
      WHERE category_id = :categoryId
          AND item_id = :itemId
  )
