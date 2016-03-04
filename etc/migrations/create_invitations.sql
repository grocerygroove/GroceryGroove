-- rambler up
CREATE TABLE invitations (
    inviter_email users.email%TYPE NOT NULL,
    invitation_token TEXT NOT NULL,

    FORIEGN KEY (inviter_email) REFERENCES users(email)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);
-- rambler down
DROP TABLE invitations;
