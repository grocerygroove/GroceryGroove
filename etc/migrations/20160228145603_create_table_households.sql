-- rambler up
CREATE TABLE households(
    household_id      SERIAL,
    name              TEXT    NOT NULL,
    created_by_id     INTEGER     NULL,
    household_admin   INTEGER NOT NULL,

    PRIMARY KEY(household_id)
);

-- rambler down
DROP TABLE households;

