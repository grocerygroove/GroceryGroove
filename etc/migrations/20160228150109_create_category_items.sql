-- rambler up
CREATE TABLE category_items (
    item_name       TEXT    NOT NULL,
    category_name   TEXT    NOT NULL,
    household_id    INTEGER NULL DEFAULT NULL,

    FOREIGN KEY (item_name, household_id) REFERENCES items(name, household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (category_name) REFERENCES categories(name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY (item_name, category_name, household_id)
);

-- rambler down
DROP TABLE category_items;
