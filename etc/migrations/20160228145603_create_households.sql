-- rambler up
CREATE TABLE households (
    id      SERIAL,
    name    TEXT    NOT NULL,

    CHECK (name != ''),

    PRIMARY KEY (id)
);

-- rambler down
DROP TABLE households;
