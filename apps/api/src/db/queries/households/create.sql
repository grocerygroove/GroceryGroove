{
    returns: "one",
}

INSERT INTO households (name)
VALUES ($1)

RETURNING household_id
