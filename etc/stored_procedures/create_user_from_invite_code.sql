CREATE OR REPLACE FUNCTION create_user_from_invite_code (
    code       invites.code%TYPE,
    ptpassword TEXT,
)
RETURNS VOID
AS $$
    DECLARE
        email        users.email%TYPE;
        household_id users.household_id%TYPE;
    BEGIN
        SELECT invitee_email, household_id
        INTO STRICT email, household_id;
        FROM invitations
        INNER JOIN users ON invitations.email = users.email
        WHERE code = code;

        SELECT hash_user_password(password_plaintext)
        INTO STRICT password;

        SELECT insert_user(email, password, household_id);
    END;
$$
LANGUAGE plpgsql
VOLATILE
STRICT
