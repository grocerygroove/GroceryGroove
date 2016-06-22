-- rambler up
CREATE TABLE items (
    name TEXT NOT NULL,    

    CHECK (name != ''),

    

    PRIMARY KEY (name)
);

-- rambler down
DROP TABLE items;
