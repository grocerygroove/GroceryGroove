const queries = require("../../queries");

module.exports = async function (logger, {
  householdName,
  userId,
}, client) {
  const householdId = await queries.households.create(client, logger, {
    name: householdName,
  });

  await queries.households.setInitialUser(client, logger, {
    userId,
    householdId,
  });
  return householdId;
};
