-- rambler up
CREATE TABLE invitations(
    invitation_id    SERIAL,
    inviter_email    CITEXT    NOT NULL,
    invitation_token TEXT      NOT NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (inviter_email) REFERENCES users(email)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    UNIQUE(invitation_token),

    PRIMARY KEY(invitation_id)
);

-- rambler down
DROP TABLE invitations;
