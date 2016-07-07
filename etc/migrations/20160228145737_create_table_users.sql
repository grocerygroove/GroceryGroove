-- rambler up
CREATE TABLE users(
    user_id              SERIAL,
    email                CITEXT      NULL,
    phone_number         TEXT        NULL,
    password             TEXT        NULL,
    default_household_id INTEGER     NULL,
    activated            BOOLEAN NOT NULL DEFAULT TRUE,
    activation_code      TEXT        NULL,
    invited_by_id        INTEGER     NULL,


    FOREIGN KEY(invited_by_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY(default_household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    CONSTRAINT email_and_password CHECK((email IS NULL) = (password IS NULL)),
    CONSTRAINT unique_users_email UNIQUE(email),

    PRIMARY KEY(user_id)
);

-- rambler down
DROP TABLE users;
