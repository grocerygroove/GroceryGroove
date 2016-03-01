CREATE OR REPLACE FUNCTION create_user(
    email        users.email%TYPE,
    password     users.password%TYPE,
    household_id users.household_id%TYPE DEFAULT NULL
)
RETURNS VOID
AS $$
    BEGIN
        IF household_id IS NULL THEN
            SELECT create_household('home')
            INTO household_id;
        END IF;

        INSERT INTO users(email, password, household_id)
        VALUES(email, password, household_id);
    END;
$$
LANGUAGE plpgsql
VOLATILE
