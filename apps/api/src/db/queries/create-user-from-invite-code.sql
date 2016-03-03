INSERT INTO users (email, password, household_id)
SELECT ii.invitee_email, CRYPT($2, GEN_SALT('bf', 8)), uu.household_id
FROM invitations ii
INNER JOIN users uu ON ii.email = uu.email
WHERE ii.code = $1
