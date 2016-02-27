-- rambler up

CREATE TABLE grocery_lists (
	id serial PRIMARY KEY,
	household_id serial references households(id),
	name varchar(70) NOT NULL,
	created_by varchar(50) references users(username),
	created_at timestamp not null default CURRENT_TIMESTAMP,
	completed_at timestamp NULL,
	total_estimated_cost integer	NULL
);

CREATE TABLE grocery_list_items (
  list serial references grocery_lists(id),
  item serial references category_items(id),
  quantity_type varchar(20) references quantity_types(name),
  quantity decimal NOT NULL,
  purchased_at timestamp DEFAULT null,
  purchased_by varchar(50) references users(username) DEFAULT null, --pretty sure foriegn keys are nullable???
  added_by varchar(50) references users(username),
  unit_cost money DEFAULT 0.00,
  PRIMARY KEY (list, item)
);

-- rambler down

DROP TABLE grocery_lists;
DROP TABLE grocery_list_items;
