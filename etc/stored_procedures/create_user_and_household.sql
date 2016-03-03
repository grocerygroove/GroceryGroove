CREATE OR REPLACE FUNCTION create_user_and_household (
    email          users.email%TYPE,
    ptpassword     TEXT,
    household_name households.name%TYPE,
)
RETURNS VOID
AS $$
    DECLARE
        household_id households.id%TYPE;
    BEGIN
        SELECT insert_household(household_name)
        INTO household_id;

        SELECT insert_user(email, ptpassword, household_id);
    END;
$$
LANGUAGE plpgsql
VOLATILE
STRICT

