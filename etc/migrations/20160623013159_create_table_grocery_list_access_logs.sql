-- rambler up

CREATE TABLE grocery_list_access_logs (
    grocery_list_id        INTEGER     NOT NULL,
    access_time  	       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (grocery_list_id) REFERENCES grocery_lists(grocery_list_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY (grocery_list_id, access_time)
);

-- rambler down
DROP TABLE grocery_list_access_log;
