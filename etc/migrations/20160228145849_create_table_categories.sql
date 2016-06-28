-- rambler up
CREATE TABLE categories(
    category_id  SERIAL,
    household_id INTEGER     NULL,
    name         TEXT    NOT NULL,

    CHECK(name != ''),

    UNIQUE(household_id, name),

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(category_id)
);

INSERT INTO categories(name) VALUES
('Beverages'),
('Bread/Bakery'),
('Canned Goods'),
('Dairy'),
('Baking Goods'),
('Frozen Foods'),
('Meat'),
('Produce'),
('Home Goods'),
('Personal Care'),
('Other');

-- rambler down
DROP TABLE categories;
