-- rambler up

CREATE TABLE households (
	id serial PRIMARY KEY,
	name varchar(70) NOT NULL CHECK (name <> '')
);

CREATE TABLE users (
	username varchar(50) PRIMARY KEY CHECK (username <> ''),
	password varchar(64) NOT NULL,
	email citext NOT NULL UNIQUE,
	household_id serial references households(id)
);

CREATE TABLE grocery_lists (
	id serial PRIMARY KEY,
	household_id serial references households(id),
	name varchar(70) NOT NULL,
	created_by varchar(50) references users(username),
	created_at timestamp not null default CURRENT_TIMESTAMP,
	completed_at timestamp NULL,
	total_estimated_cost integer	NULL
);

-- rambler down

DROP TABLE households;
DROP TABLE users;
DROP TABLE grocery_lists;
