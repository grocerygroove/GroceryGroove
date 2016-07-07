-- rambler up
CREATE TABLE quantity_types(
    quantity_type_id      SERIAL,
    household_id          INTEGER     NULL,
    singular_name         TEXT    NOT NULL,
    plural_name           TEXT    NOT NULL,
    singular_abbreviation TEXT    NOT NULL,
    plural_abbreviation   TEXT    NOT NULL,

    CHECK(singular_name != ''),
    CHECK(plural_name != ''),
    CHECK(singular_abbreviation != ''),
    CHECK(plural_abbreviation != ''),

    UNIQUE(household_id, singular_name),
    UNIQUE(household_id, plural_name),
    UNIQUE(household_id, singular_abbreviation),
    UNIQUE(household_id, plural_abbreviation),

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(quantity_type_id)
);

INSERT INTO quantity_types
(singular_name, plural_name, singular_abbreviation, plural_abbreviation) VALUES
('piece',       'pieces',    'pc',                  'pcs'              ),
('cup',         'cups',      'cup',                 'cups'             ),
('gallon',      'gallons',   'gal',                 'gal'              ),
('ounce',       'ounces',    'oz',                  'oz'               ),
('pint',        'pints',     'pt',                  'pt'               ),
('quart',       'quarts',    'qt',                  'qt'               ),
('pound',       'pounds',    'lb',                  'lbs'              );

-- rambler down
DROP TABLE quantity_types;
