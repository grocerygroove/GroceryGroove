CREATE OR REPLACE FUNCTION insert_user (
    email              users.email%TYPE,
    password_plaintext TEXT,
    household_id       users.household_id%TYPE,
)
RETURNS VOID
AS $$
    DECLARE
        password users.password%TYPE;
    BEGIN
        SELECT crypt(password_plaintext, gen_salt('bf', 8))
        INTO STRICT password;

        INSERT INTO users (email, password, household_id)
        VALUES (email, password, household_id);
    END;
$$
LANGUAGE plpgsql
VOLATILE
STRICT
