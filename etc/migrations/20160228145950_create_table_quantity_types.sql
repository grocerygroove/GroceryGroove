-- rambler up
CREATE TABLE quantity_types(
    quantity_type_id      SERIAL,
    singular_name         TEXT    NOT NULL,
    plural_name           TEXT    NOT NULL,
    singular_abbreviation TEXT        NULL,
    plural_abbreviation   TEXT        NULL,

    PRIMARY KEY(quantity_type_id)
);

CREATE UNIQUE INDEX unique_quanity_type_singular_name         ON quantity_types (singular_name);
CREATE UNIQUE INDEX unique_quanity_type_plural_name           ON quantity_types (plural_name);
CREATE UNIQUE INDEX unique_quanity_type_singular_abbreviation ON quantity_types (singular_abbreviation);
CREATE UNIQUE INDEX unique_quanity_type_plural_abbreviation   ON quantity_types (plural_abbreviation);


INSERT INTO quantity_types
(singular_name, plural_name, singular_abbreviation, plural_abbreviation) VALUES
('pack',        'packs',     NULL,                  NULL               ),
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
DROP INDEX unique_quanity_type_plural_abbreviation;
DROP INDEX unique_quanity_type_singular_abbreviation;
DROP INDEX unique_quanity_type_plural_name;
DROP INDEX unique_quanity_type_singular_name;
DROP TABLE quantity_types;
