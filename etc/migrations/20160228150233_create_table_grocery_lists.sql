-- rambler up
CREATE TABLE grocery_lists(
    grocery_list_id       SERIAL,
    household_id          INTEGER   NOT NULL,
    created_by_id         INTEGER   NOT NULL,
    name                  TEXT      NOT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at          TIMESTAMP     NULL,

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    FOREIGN KEY(created_by_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    CONSTRAINT unique_grocery_list_name UNIQUE(household_id, name),

    PRIMARY KEY(grocery_list_id)
);

-- rambler down
DROP TABLE grocery_lists;
