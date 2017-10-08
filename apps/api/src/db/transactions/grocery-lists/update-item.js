const addAndCategorizeItem = require("../items/add-and-categorize-item");
const InvalidCategoryError = require("../../../errors/invalid-category-error");
const InvalidGroceryListError = require("../../../errors/invalid-grocery-list-error");
const InvalidQuantityTypeError = require("../../../errors/invalid-quantity-type-error");
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

  //Ensure quantity type is valid (if passed in)
  const quantityTypeIds = (await queries.quantityTypes.getAll(client, logger, {
    householdId,
  })).map(x => x.quantity_type_id);
  if(quantityTypeId && quantityTypeIds.indexOf(quantityTypeId) == -1)
    return Promise.reject(new InvalidQuantityTypeError(__filename));

  //If itemName is passed in to be updated, ensure item is added
  //and categorized
  let itemId = null;
  if (itemName) {
    //Check to see whether item exists
    itemId = await queries.items.getItemByName(client, logger, {
      householdId,
      name: itemName,
    });

    if(!itemId) { //Add item
      itemId = await queries.items.createItem(client, logger, {
        householdId,
        name: itemName,
      });
    }
    let categoryIdLocal = categoryId;
    if(!categoryIdLocal) {
      //If category id isn't passed in, get it
      const groceryListItems = queries.groceryLists.items.getAll(client, logger, {
        userId,
        groceryListId,
      });
      const thisGroceryListItem = groceryListItems.filter(x => x.grocery_list_item_id == groceryListItemId)[0];
      if(!thisGroceryListItem) {
        throw new Error("Invalid grocery list item");
      }
      categoryIdLocal = thisGroceryListItem.category_id;
      //Ensure item is categorized
      await queries.items.createCategoryItem(client, logger, {
        itemId,
        categoryId: categoryIdLocal,
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
