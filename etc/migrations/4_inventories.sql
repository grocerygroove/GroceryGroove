-- rambler up

CREATE TABLE inventory_items (
  household_id serial references households(id),
  category_item serial references category_items(id),
  quantity_type varchar(20) references quantity_types(name),
  quantity decimal DEFAULT 0.00,
  expiration_date timestamp DEFAULT null
);

-- rambler down

DROP TABLE inventory_items;
