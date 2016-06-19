-- rambler up
CREATE TABLE invitations (
    inviter_email    CITEXT NOT NULL,
    invitation_token TEXT   NOT NULL,

    FOREIGN KEY (inviter_email) REFERENCES users(email)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

-- rambler down
DROP TABLE invitations;
