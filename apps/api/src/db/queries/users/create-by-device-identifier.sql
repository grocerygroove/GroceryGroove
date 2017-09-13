{

  namedParameters: {
    enabled: true,
  },

  returns: "one",
}

INSERT INTO users (device_identifier, nickname)
SELECT :deviceIdentifier, :nickname
RETURNING user_id
