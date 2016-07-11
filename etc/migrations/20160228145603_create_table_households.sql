-- rambler up
CREATE TABLE households(
    household_id      SERIAL,
    name              TEXT    NOT NULL,
    created_by_id     INTEGER     NULL,

    PRIMARY KEY(household_id)
);

-- rambler down
DROP TABLE households;
DROP TABLE household_types;
