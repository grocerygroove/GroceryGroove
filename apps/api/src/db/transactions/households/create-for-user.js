const queries = require("../../queries");

module.exports = async function (client, logger, {
    householdName,
    userId,
}) {
    const householdId = await queries.households.create(client, logger, {
        name: householdName,
    });

    await queries.households.setInitialUser(client, logger, {
        userId,
        householdId,
    });

    return householdId;
};
