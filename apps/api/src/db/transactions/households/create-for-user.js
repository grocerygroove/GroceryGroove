const queries = require("../../queries");
 
module.exports = (db, logger,{ householdName, userId }) => db.transaction(logger, async (client) => {
        const householdId = await queries.households.create(client, logger, [
            householdName,
        ]);
   
        await queries.households.setInitialUser(client, logger, {
            userId,
            householdId,
        });
   
        return householdId;
});