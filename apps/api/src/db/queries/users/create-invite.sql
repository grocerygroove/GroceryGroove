{
    returns: "one",
}

-- TODO find better token generator
INSERT INTO invitations(inviter_email, invitation_token)
VALUES(                 $1,            create_hashed_password($1))
RETURNING invitation_token
