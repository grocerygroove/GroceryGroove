-- rambler up
CREATE TABLE invitations (
    inviter_email users.email%TYPE NOT NULL,

-- rambler down
DROP TABLE invitations;
