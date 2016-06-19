WITH create_household AS (
    INSERT INTO households (name)
    VALUES (CONCAT($1::TEXT, E'\'s Home'))
    RETURNING household_id
)

INSERT INTO users (email, password,                         household_id)
SELECT             $1,    create_hashed_password($2::TEXT), household_id
FROM create_household
