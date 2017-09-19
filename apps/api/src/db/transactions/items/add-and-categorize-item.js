const queries = require("../../queries");

module.exports = async function (client, logger, {
  householdId,
  name,
  description,
  categoryId,
}) {
  let itemId = await queries.items.getItemByName(client, logger, {
    householdId,
    name,
  });

  if(!itemId) {
    itemId = await queries.items.createItem(client, logger, {
      householdId,
      name,
      description,
    });
  }

  await queries.items.createCategoryItem(client, logger, {
    categoryId,
    itemId,
  });

  return itemId;
};
