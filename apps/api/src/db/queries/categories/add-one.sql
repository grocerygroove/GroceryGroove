{
    errorHandling: {
        states: {
            23505: require("../../../errors/duplicate-name-error"),
        },
    },
}
INSERT INTO categories (household_id, name, created_by_id)
VALUES ($1, $3, $2)
