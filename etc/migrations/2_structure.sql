-- rambler up

CREATE TABLE categories (
  name varchar(50) PRIMARY KEY NOT NULL CHECK (name <> '')
);

CREATE TABLE quantity_types (
  name varchar(20) PRIMARY KEY CHECK (name <> '')
);

CREATE TABLE items (
  name varchar(70) PRIMARY KEY CHECK (name <> '')
);

CREATE TABLE category_items (
  id serial PRIMARY KEY,
  item_name varchar(70) references items(name),
  category_name varchar(50) references categories(name),
  UNIQUE (item_name, category_name)
);

-- rambler down

DROP TABLE categories;
DROP TABLE quantity_types;
DROP TABLE items;
DROP TABLE category_items;
