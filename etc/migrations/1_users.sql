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

-- rambler down

DROP TABLE households;
DROP TABLE users;
