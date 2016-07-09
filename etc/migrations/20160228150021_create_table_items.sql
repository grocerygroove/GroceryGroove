-- rambler up
CREATE TABLE items(
    item_id      SERIAL,
    household_id INTEGER     NULL,
    name         TEXT    NOT NULL,
    description  TEXT    NOT NULL DEFAULT '',

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(item_id)
);

CREATE UNIQUE INDEX unique_item_name          ON items (household_id, name) WHERE household_id IS NOT NULL;
CREATE UNIQUE INDEX unique_item_name_null     ON items (name) WHERE household_id IS NULL;

-- rambler down
DROP INDEX unique_item_name_null;
DROP INDEX unique_item_name;
DROP TABLE items;
