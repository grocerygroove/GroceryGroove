CREATE OR REPLACE FUNCTION insert_household (
    name households.name%TYPE,
)
RETURNS households.id%TYPE,
AS $$
    DECLARE
        retval households.id%TYPE;
    BEGIN
        INSERT INTO households(name)
        VALUES(name)
        RETURNING id INTO STRICT retval;

        RETURN retval;
    END
$$
LANGUAGE plpgsql
VOLATILE
STRICT

