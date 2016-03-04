INSERT INTO grocery_lists (household_id, name, created_by_email)
VALUES(
        (SELECT household_id FROM users WHERE email = $1),
        $2,
        $1
      )
RETURNING id
