-- rambler up
CREATE TABLE households (
    household_id SERIAL,
    name         TEXT    NOT NULL,

    CHECK (name != ''),

    PRIMARY KEY (household_id)
);

-- rambler down
DROP TABLE households;
