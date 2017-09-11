{
  errorStateToExceptionMap: {
    23505: require("../../../errors/duplicate-name-error"),
  },

  namedParameters: {
    enabled: true,
  },
}
INSERT INTO quantity_types (household_id, singular_name, plural_name, singular_abbreviation, plural_abbreviation)
VALUES (:householdId, :singularName, :pluralName, :singularAbbreviation, :pluralAbbreviation)
