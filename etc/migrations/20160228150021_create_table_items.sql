-- rambler up
CREATE TABLE items(
    item_id      SERIAL,
    household_id INTEGER     NULL,
    name         TEXT    NOT NULL,
    description  TEXT    NOT NULL DEFAULT '',

    CONSTRAINT unique_item_name UNIQUE(COALESCE(household_id, -1), name),

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(item_id)
);

-- rambler down
DROP TABLE items;
