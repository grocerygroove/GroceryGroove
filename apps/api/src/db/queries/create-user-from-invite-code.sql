INSERT INTO users(email,            password,                   household_id)
SELECT            ii.invitee_email, create_hashed_password($2), uu.household_id
FROM invitations ii
INNER JOIN users uu ON ii.email = uu.email
WHERE ii.code = $1
  AND ii.created_at > NOW() - '7 days'::INTERVAL
