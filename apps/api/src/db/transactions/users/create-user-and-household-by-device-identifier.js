const queries = require("../../queries");

module.exports = async function (client, logger, {
  deviceIdentifier,
  nickname,
}) {

  const householdId = await queries.households.create(client, logger, {
    name: `${nickname}'s Household`,
  });

  const userId = await queries.users.createByDeviceIdentifier(client, logger, {
    deviceIdentifier,
    nickname,
  });

  await queries.households.setInitialUser(client, logger, {
    userId,
    householdId,
  });

  await queries.users.setPrimaryHousehold(client, logger, {
    userId,
    householdId,
  });

  return {
    userId,
    householdId,
  };
};
