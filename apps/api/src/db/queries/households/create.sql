{
    returns: "one",

    namedParameters: {
        enabled: true,
    },
}

INSERT INTO households (name)
VALUES (:name)

RETURNING household_id
