-- rambler up
CREATE TABLE grocery_list_items (
    grocery_list_id         INTEGER     NOT NULL,
    household_id            INTEGER     NOT NULL,
    item_name               TEXT        NOT NULL,
    quantity_type_name      TEXT        NOT NULL,
    quantity                DECIMAL     NOT NULL,
    purchased_at            TIMESTAMP   NULL DEFAULT NULL,
    purchased_by_username   TEXT        NULL DEFAULT NULL,
    added_by_username       TEXT        NOT NULL,
    unit_cost               MONEY       NULL DEFAULT NULL,

    FOREIGN KEY (household_id) REFERENCES households(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (grocery_list_id) REFERENCES grocery_lists(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (item_name, household_id) REFERENCES items(name, household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (quantity_type_name, household_id) REFERENCES quantity_types(name, household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (purchased_by_username) REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (added_by_username) REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,


    PRIMARY KEY (grocery_list_id, item_name)
);

-- rambler down
