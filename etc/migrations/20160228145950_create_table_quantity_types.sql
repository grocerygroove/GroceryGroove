-- rambler up
CREATE TABLE quantity_types (
    name TEXT NOT NULL,
    

    CHECK (name != ''),

    PRIMARY KEY (name)
);

INSERT INTO quantity_types (name) VALUES ('pc(s)');
INSERT INTO quantity_types (name) VALUES ('cup(s)');
INSERT INTO quantity_types (name) VALUES ('gal(s)');
INSERT INTO quantity_types (name) VALUES ('oz(s)');
INSERT INTO quantity_types (name) VALUES ('pt(s)');
INSERT INTO quantity_types (name) VALUES ('qt(s)');
INSERT INTO quantity_types (name) VALUES ('lb(s)');

-- rambler down
DROP TABLE quantity_types;
