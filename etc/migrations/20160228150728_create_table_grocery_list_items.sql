-- rambler up
CREATE TABLE grocery_list_items (
    grocery_list_item_id SERIAL    NOT NULL,
    grocery_list_id      INTEGER   NOT NULL,
    item_id              INTEGER   NOT NULL,
    category_id          INTEGER   NOT NULL,
    quantity_type_id     INTEGER   NOT NULL,
    quantity             DECIMAL   NOT NULL,
    added_by_id          INTEGER    NOT NULL,
    purchased_at         TIMESTAMP     NULL,
    purchased_by_id      INTEGER       NULL,
    unit_cost            MONEY         NULL,

    FOREIGN KEY(grocery_list_id) REFERENCES grocery_lists(grocery_list_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(item_id) REFERENCES items(item_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(category_id) REFERENCES categories(category_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(quantity_type_id) REFERENCES quantity_types(quantity_type_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(purchased_by_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(added_by_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    CONSTRAINT unique_grocery_list_item UNIQUE(grocery_list_id, item_id, category_id),
    CONSTRAINT consistent_grocery_list_purchase_data CHECK(
        (purchased_at IS NULL) = (purchased_by_id IS NULL)
    ),

    PRIMARY KEY(grocery_list_item_id)
);

-- rambler down
DROP TABLE grocery_list_items;
