{
    language: "plpgsql",

    returns: { typealias: "households.id" },
    arguments: [
        { name: "name", typealias: "households.name" },
    ],

    declare: [
        { name: "v_id", typealias: "households.id" },
    ],

    volatile: true,
    strict: true,
}

INSERT INTO households(name)
VALUES(name)
RETURNING id INTO STRICT v_id;

RETURN v_id;
