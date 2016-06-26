-- rambler up
CREATE TABLE categories (
    name TEXT NOT NULL

    CHECK (name != ''),

    PRIMARY KEY (name)
);

INSERT INTO categories (name) VALUES ('Beverages');
INSERT INTO categories (name) VALUES ('Bread/Bakery');
INSERT INTO categories (name) VALUES ('Canned Goods');
INSERT INTO categories (name) VALUES ('Dairy');
INSERT INTO categories (name) VALUES ('Baking Goods');
INSERT INTO categories (name) VALUES ('Frozen Foods');
INSERT INTO categories (name) VALUES ('Meat');
INSERT INTO categories (name) VALUES ('Produce');
INSERT INTO categories (name) VALUES ('Home Goods');
INSERT INTO categories (name) VALUES ('Personal Care');
INSERT INTO categories (name) VALUES ('Other');

-- rambler down
DROP TABLE categories;
