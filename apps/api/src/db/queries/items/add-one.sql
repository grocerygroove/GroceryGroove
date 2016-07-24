{
    returns: "one",
    errorHandling: {
        states: {
            23505: require("../../../errors/duplicate-name-error"),
        },
    },
}
INSERT INTO items (household_id, name, description)
VALUES ($1, $2, $3)
RETURNING item_id
