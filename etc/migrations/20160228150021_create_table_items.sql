-- rambler up
CREATE TABLE items(
    item_id      SERIAL,
    household_id INTEGER     NULL,
    name         TEXT    NOT NULL,

    UNIQUE(household_id, name),

    CHECK(name != ''),

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(item_id)
);

-- rambler down
DROP TABLE items;
