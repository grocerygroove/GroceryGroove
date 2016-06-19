-- rambler up
CREATE FUNCTION create_hashed_password(p_password TEXT)
RETURNS TEXT
LANGUAGE 'plpgsql'
IMMUTABLE
STRICT
AS $$
DECLARE
BEGIN
    RETURN CRYPT(p_password, GEN_SALT('bf', 8));
END
$$;

-- rambler down
DROP FUNCTION hash_password(TEXT);
