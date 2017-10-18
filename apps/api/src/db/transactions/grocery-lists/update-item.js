const InvalidCategoryError = require("../../../errors/invalid-category-error");
const InvalidGroceryListError = require("../../../errors/invalid-grocery-list-error");
const InvalidGroceryListItemError = require("../../../errors/invalid-grocery-list-item-error");
const queries = require("../../queries");

module.exports = async function(client, logger, {
  userId,
  householdId,
  groceryListId,
  groceryListItemId,
  itemName,
  categoryId,
  quantityTypeId,
  quantity,
  checked,
  purchased,
  unitCost,
}) {

  //Ensure user has access to Grocery List
  const groceryListIds = (await queries.groceryLists.getAll(client, logger, {
    userId,
    householdId,
  })).map(x => x.grocery_list_id);
  if(groceryListIds.indexOf(groceryListId) == -1) 
    return Promise.reject(new InvalidGroceryListError(__filename));

  //Ensure category is valid (if passed in)
  const categoryIds = (await queries.categories.getAll(client, logger, {
    householdId,
  })).map(x => x.category_id);
  if(categoryId && categoryIds.indexOf(categoryId) == -1)
    return Promise.reject(new InvalidCategoryError(__filename));

  const groceryListItems = await queries.groceryLists.items.getAll(client, logger, {
    userId,
    groceryListId,
  });
  const thisGroceryListItem = groceryListItems.filter(x => x.grocery_list_item_id == groceryListItemId)[0];
  if(!thisGroceryListItem)
    return Promise.reject(new InvalidGroceryListItemError(__filename));

  //If itemName has been passed in,
  //go fetch the itemId if it exists,
  //if not, add the item
  let itemId = null;
  if (itemName) {
    itemId = await queries.items.getItemByName(client, logger, {
      householdId,
      name: itemName,
    });

    if(!itemId) {
      //Create item
      itemId = await queries.items.createItem(client, logger, {
        householdId,
        name: itemName,
      });
    }
  }

  let purchasedAt = null;
  let purchasedById = null;
  if (purchased) {
    purchasedAt = new Date();
    purchasedById = userId;
  }

  const updatedId = await queries.groceryLists.items.updateOne(client, logger, {
    householdId,
    userId,
    groceryListId,
    groceryListItemId,
    itemId,
    categoryId,
    quantityTypeId,
    quantity,
    checked,
    purchasedAt,
    purchasedById,
    unitCost,
  });

  return !!updatedId;
};
