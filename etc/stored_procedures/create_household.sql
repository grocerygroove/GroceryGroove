CREATE OR REPLACE FUNCTION create_household(
  name households.name%TYPE
)
    RETURNS INTEGER
AS $$
    DECLARE
        v_id INTEGER;
    BEGIN
        INSERT INTO households(name)
        VALUES(name)
        RETURNING id INTO STRICT v_id;

        RETURN v_id;
    END;
$$
LANGUAGE plpgsql
VOLATILE
STRICT
