WITH create_household AS (
    INSERT INTO households (name)
    VALUES (CONCAT($1, '\'s Home'))
    RETURNING id
)

INSERT INTO users (email, password,                   household_id)
SELECT             $1,    create_hashed_password($2), id
FROM create_household
