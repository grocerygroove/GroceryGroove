{

  namedParameters: {
    enabled: true,
  },

  returns: "one",
}

INSERT INTO users (email, password)
SELECT :email, create_hashed_password(:password::TEXT)
RETURNING user_id
