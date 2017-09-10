const queries = require("../../queries");

module.exports = async function (client, logger, {
  email,
  password,
}) {

  const householdId = await queries.households.create(client, logger, {
    name: `${email}'s Household`,
  });

  const userId = await queries.users.createByEmail(client, logger, {
    email,
    password,
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
