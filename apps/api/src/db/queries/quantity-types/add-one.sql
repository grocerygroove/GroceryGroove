{
    errorHandling: {
        states: {
            23505: require("../../../errors/duplicate-name-error"),
        },
    },
}
INSERT INTO quantity_types (household_id, singular_name, plural_name, singular_abbreviation, plural_abbreviation)
VALUES ($1, $2, $3, $4, $5)
