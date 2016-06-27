INSERT INTO grocery_lists_access_log (grocery_list_id, access_time)
VALUES                               ($1,              NOW()      )
