-- rambler up
CREATE TABLE quantity_types(
    quantity_type_id      SERIAL,
    household_id          INTEGER     NULL,
    singular_name         TEXT    NOT NULL,
    plural_name           TEXT    NOT NULL,
    singular_abbreviation TEXT        NULL,
    plural_abbreviation   TEXT        NULL,

    FOREIGN KEY(household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY(quantity_type_id)
);

CREATE UNIQUE INDEX unique_quanity_type_singular_name                ON quantity_types (household_id, singular_name) WHERE household_id IS NOT NULL;
CREATE UNIQUE INDEX unique_quanity_type_singular_name_null           ON quantity_types (singular_name) WHERE household_id IS NULL;
CREATE UNIQUE INDEX unique_quanity_type_plural_name                  ON quantity_types (household_id, plural_name) WHERE household_id IS NOT NULL;
CREATE UNIQUE INDEX unique_quanity_type_plural_name_null             ON quantity_types (plural_name) WHERE household_id IS NULL;
CREATE UNIQUE INDEX unique_quanity_type_singular_abbreviation        ON quantity_types (household_id, singular_abbreviation) WHERE household_id IS NOT NULL;
CREATE UNIQUE INDEX unique_quanity_type_singular_abbreviation_null   ON quantity_types (singular_abbreviation) WHERE household_id IS NULL;
CREATE UNIQUE INDEX unique_quanity_type_plural_abbreviation          ON quantity_types (household_id, plural_abbreviation) WHERE household_id IS NOT NULL;
CREATE UNIQUE INDEX unique_quanity_type_plural_abbreviation_null     ON quantity_types (plural_abbreviation) WHERE household_id IS NULL;


INSERT INTO quantity_types
(singular_name, plural_name, singular_abbreviation, plural_abbreviation) VALUES
('piece',       'pieces',    'pc',                  'pcs'              ),
('cup',         'cups',      NULL,                  NULL               ),
('gallon',      'gallons',   'gal',                 NULL               ),
('ounce',       'ounces',    'oz',                  NULL               ),
('pint',        'pints',     'pt',                  NULL               ),
('quart',       'quarts',    'qt',                  NULL               ),
('pound',       'pounds',    'lb',                  'lbs'              ),
('liter',       'liters',    'l',                   NULL               ),
('gram',        'grams',     'g',                   NULL               );

-- rambler down
DROP INDEX unique_quanity_type_plural_abbreviation_null;
DROP INDEX unique_quanity_type_plural_abbreviation;
DROP INDEX unique_quanity_type_singular_abbreviation_null;
DROP INDEX unique_quanity_type_singular_abbreviation;
DROP INDEX unique_quanity_type_plural_name_null;
DROP INDEX unique_quanity_type_plural_name;
DROP INDEX unique_quanity_type_singular_name_null;
DROP INDEX unique_quanity_type_singular_name;
DROP TABLE quantity_types;
