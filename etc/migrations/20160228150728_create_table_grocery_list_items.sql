-- rambler up
CREATE TABLE grocery_list_item (
    grocery_list_id         INTEGER   NOT NULL,
    item_id                 INTEGER   NOT NULL,
    quantity_type_id        INTEGER   NOT NULL,
    quantity                DECIMAL   NOT NULL,
    added_by_email          CITEXT    NOT NULL,

    purchased_at            TIMESTAMP     NULL,
    purchased_by_email      CITEXT        NULL,
    unit_cost               MONEY         NULL,

    FOREIGN KEY(grocery_list_id) REFERENCES grocery_lists(grocery_list_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(item_id) REFERENCES items(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(quantity_type_id) REFERENCES quantity_types(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(purchased_by_email) REFERENCES users(email)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(added_by_email) REFERENCES users(email)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY (grocery_list_id, item_id)
);

-- rambler down
DROP TABLE grocery_list_items;
