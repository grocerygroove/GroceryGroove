{
    language: "plpgsql",
    arguments: [
        { name: "email", typealias: "users.email" },
        { name: "password", typealias: "users.password" },
    ],
    declare: [
        { name: "household_id", typealias: "households.id" },
    ],

    returns: void(0),

    strict: true,
    volatile: true,
}

SELECT create_household('home')
INTO household_id;

INSERT INTO users(email, password, household_id)
VALUES(email, password, household_id);
