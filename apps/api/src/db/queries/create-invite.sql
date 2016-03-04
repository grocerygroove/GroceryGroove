INSERT INTO invitations (inviter_email, invitation_token)
VALUES ($1, CRYPT($1, GEN_SALT('bf', 8)))
RETURNING invitation_token
