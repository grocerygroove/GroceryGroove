-- rambler up
CREATE TABLE categories(
    category_id   SERIAL,
    household_id  INTEGER     NULL,
    name          TEXT    NOT NULL,
    created_by_id INTEGER     NULL,

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(created_by_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    CONSTRAINT unique_category_name UNIQUE(COALESCE(household_id, NULL), name),

    PRIMARY KEY(category_id)
);

INSERT INTO categories(household_id, created_by_id, name) VALUES
(NULL, NULL, 'Beverages'),
(NULL, NULL, 'Bread/Bakery'),
(NULL, NULL, 'Canned Goods'),
(NULL, NULL, 'Dairy'),
(NULL, NULL, 'Baking Goods'),
(NULL, NULL, 'Frozen Foods'),
(NULL, NULL, 'Meat'),
(NULL, NULL, 'Produce'),
(NULL, NULL, 'Home Goods'),
(NULL, NULL, 'Personal Care'),
(NULL, NULL, 'Other');

-- rambler down
DROP TABLE categories;
