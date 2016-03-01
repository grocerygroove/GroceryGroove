-- rambler up
CREATE TABLE users (
    email           CITEXT  NOT NULL,
    password        TEXT    NOT NULL,
    household_id    INTEGER NOT NULL,

    FOREIGN KEY (household_id) REFERENCES households(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    UNIQUE (email),

    CHECK (email != ''),

    PRIMARY KEY (email)
);

-- rambler down
DROP TABLE users;
