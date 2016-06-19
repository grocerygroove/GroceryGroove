-- rambler up
CREATE TABLE grocery_lists (
    grocery_list_id       SERIAL,
    household_id          INTEGER,
    name                  TEXT      NOT NULL,
    created_by_email      CITEXT    NOT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at          TIMESTAMP NULL,
    total_estimated_cost  MONEY     NULL,

    FOREIGN KEY (household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    FOREIGN KEY (created_by_email) REFERENCES users(email)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY (id)
);

-- rambler down
DROP TABLE grocery_lists;
