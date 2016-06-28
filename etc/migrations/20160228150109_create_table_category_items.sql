-- rambler up
CREATE TABLE category_items(
    category_id TEXT    NOT NULL,
    item_id     INTEGER NOT NULL,

    FOREIGN KEY(item_id) REFERENCES items(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(category_id) REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(category_id, item_id)
);

-- rambler down
DROP TABLE category_items;
