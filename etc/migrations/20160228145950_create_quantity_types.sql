-- rambler up
CREATE TABLE quantity_types (
    name TEXT NOT NULL,
    household_id INTEGER NULL DEFAULT NULL,

    CHECK (name != ''),

    FOREIGN KEY (household_id) REFERENCES households(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY (name, household_id)
);

-- rambler down
DROP TABLE quantity_types;
