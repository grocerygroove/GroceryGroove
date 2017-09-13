{

  namedParameters: {
    enabled: true,
  },

  returns: "one",
}

INSERT INTO users (email, nickname, password)
SELECT :email, :nickname, create_hashed_password(:password::TEXT)
RETURNING user_id
