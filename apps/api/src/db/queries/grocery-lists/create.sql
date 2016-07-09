{
    returns: "one",
}
--TODO: Authenticate that the user has access to this household...
INSERT INTO grocery_lists(household_id, name, created_by_id)
VALUES ($3, $2, $1)
RETURNING grocery_list_id
