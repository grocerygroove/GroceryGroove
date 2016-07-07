-- rambler up
CREATE TABLE quantity_types(
    quantity_type_id      SERIAL,
    household_id          INTEGER     NULL,
    singular_name         TEXT    NOT NULL,
    plural_name           TEXT    NOT NULL,
    singular_abbreviation TEXT        NULL,
    plural_abbreviation   TEXT        NULL,

    CONSTRAINT unique_quanity_type_singular_name         UNIQUE(COALESCE(household_id, -1), singular_name),
    CONSTRAINT unique_quanity_type_plural_name           UNIQUE(COALESCE(household_id, -1), plural_name),
    CONSTRAINT unique_quanity_type_singular_abbreviation UNIQUE(COALESCE(household_id, -1), singular_abbreviation),
    CONSTRAINT unique_quanity_type_plural_abbreviation   UNIQUE(COALESCE(household_id, -1), plural_abbreviation),

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(quantity_type_id)
);

INSERT INTO quantity_types
(singular_name, plural_name, singular_abbreviation, plural_abbreviation) VALUES
('piece',       'pieces',    'pc',                  'pcs'              ),
('cup',         'cups',      NULL,                  NULL               ),
('gallon',      'gallons',   'gal',                 NULL               ),
('ounce',       'ounces',    'oz',                  NULL               ),
('pint',        'pints',     'pt',                  NULL               ),
('quart',       'quarts',    'qt',                  NULL               ),
('pound',       'pounds',    'lb',                  'lbs'              );

-- rambler down
DROP TABLE quantity_types;
