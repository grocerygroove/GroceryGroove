-- rambler up
CREATE TABLE household_location_types(
    type TEXT PRIMARY KEY
);
INSERT INTO household_location_types(type) VALUES
('House'),
('Apartment'),
('Condo'),
('Office');

CREATE TABLE households(
    household_id      SERIAL,
    name              TEXT    NOT NULL,
    physical_location BOOLEAN NOT NULL,
    location_type     TEXT        NULL,
    street_address    TEXT        NULL,
    street_address2   TEXT        NULL,
    city              TEXT        NULL,
    state             TEXT        NULL,
    zip               TEXT        NULL,
    created_by_id     INTEGER     NULL,

    FOREIGN KEY(location_type) REFERENCES household_location_types(type)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(household_id)
);

-- rambler down
DROP TABLE households;
DROP TABLE household_types;
