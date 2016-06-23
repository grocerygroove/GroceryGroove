-- rambler up

CREATE TABLE grocery_lists_access_log (
    grocery_list_id        INTEGER     NOT NULL,
    household_id           INTEGER     NOT NULL,
    access_time  	       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (grocery_list_id) REFERENCES grocery_lists(grocery_list_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY (grocery_list_id, household_id, access_time)
);

-- rambler down
DROP TABLE grocery_lists_access_log;