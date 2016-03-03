CREATE OR REPLACE FUNCTION invite_emails_to_household (
    user_email     users.email%TYPE,
    invitee_emails users.email%TYPE[],
)
RETURNS invitations.code%TYPE[]
AS $$
    DECLARE
        code          invitations.code%TYPE;
        invitee_email users.email%TYPE;
        retval        invitations.code%TYPE[];
    BEGIN
        FOREACH invitee_email IN ARRAY invitee_emails LOOP
            INSERT INTO invitations(user_email, invitee_email)
            VALUES(user_email, invitee_email, retval)
            RETURNING code INTO STRICT code;

            ARRAY_APPEND(retval, code);
        END LOOP;

        RETURN retval;
    END;
$$
LANGUAGE plpgsql
VOLATILE
STRICT
