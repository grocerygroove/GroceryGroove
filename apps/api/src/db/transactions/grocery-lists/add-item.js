const addAndCategorizeItem = require("../items/add-and-categorize-item");
const InvalidCategoryError = require("../../../errors/invalid-category-error");
const InvalidGroceryListError = require("../../../errors/invalid-grocery-list-error");
const InvalidQuantityTypeError = require("../../../errors/invalid-quantity-type-error");
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

  //Ensure quantity type is valid
  const quantityTypeIds = (await queries.quantityTypes.getAll(client, logger, {
    householdId,
  })).map(x => x.quantity_type_id);
  if(quantityTypeIds.indexOf(quantityTypeId) == -1)
    return Promise.reject(new InvalidQuantityTypeError(__filename));

  //Add and categorize item
  const itemId = await addAndCategorizeItem(client, logger, {
    householdId,
    name: itemName,
    categoryId,
  });

  return await queries.groceryLists.items.addOne(client, logger, {
    userId,
    groceryListId,
    itemId,
    categoryId,
    quantityTypeId,
    quantity,
  });
};
