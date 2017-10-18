const InvalidCategoryError = require("../../../errors/invalid-category-error");
const InvalidGroceryListError = require("../../../errors/invalid-grocery-list-error");
const queries = require("../../queries");

module.exports = async function(client, logger, {
  userId,
  householdId,
  groceryListId,
  itemName,
  categoryId,
  quantityTypeId,
  quantity,
}) {

  //Ensure user has access to Grocery List
  const groceryListIds = (await queries.groceryLists.getAll(client, logger, {
    userId,
    householdId,
  })).map(x => x.grocery_list_id);
  if(groceryListIds.indexOf(groceryListId) == -1) 
    return Promise.reject(new InvalidGroceryListError(__filename));

  //Ensure category is valid
  const categoryIds = (await queries.categories.getAll(client, logger, {
    householdId,
  })).map(x => x.category_id);
  if(categoryIds.indexOf(categoryId) == -1)
    return Promise.reject(new InvalidCategoryError(__filename));

  let itemId = await queries.items.getItemByName(client, logger, {
    householdId,
    name: itemName,
  });

  if(!itemId) {
    itemId = await queries.items.createItem(client, logger, {
      householdId,
      name: itemName,
    });
  }

  return await queries.groceryLists.items.addOne(client, logger, {
    userId,
    groceryListId,
    itemId,
    categoryId,
    quantityTypeId,
    quantity,
  });
};
