-- rambler up
CREATE TABLE inventory_items(
    inventory_item_id SERIAL,
    household_id      INTEGER   NOT NULL,
    item_id           INTEGER   NOT NULL,
    quantity_type_id  INTEGER       NULL,
    quantity          DECIMAL       NULL,
    expires_at        TIMESTAMP     NULL,

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(item_id) REFERENCES items(item_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(quantity_type_id) REFERENCES quantity_types(quantity_type_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    CONSTRAINT unique_inventory_item_quantity UNIQUE(
        household_id,
        item_id,
        quantity_type_id
    ),

    PRIMARY KEY(inventory_item_id)
);

-- rambler down
DROP TABLE inventory_items;
