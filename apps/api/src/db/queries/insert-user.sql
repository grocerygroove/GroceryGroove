INSERT INTO users (email, password, household_id)
VALUES ($1, crypt($2, gen_salt('bf', 8), $3);
