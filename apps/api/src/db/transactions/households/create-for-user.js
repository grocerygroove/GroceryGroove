const a = require("../../../utils/asyncify");
const queries = require("../../queries");

module.exports = {
    returns: "one",

    transaction: a(function* (
        { client, logger },
        [ householdName, userId ]
    ) {
        const householdId = (yield queries.households.create(client, logger, [
            householdName,
        ]));

        (yield queries.households.setInitialUser(client, logger, [
            userId,
        ]));

        return householdId;
    }),
};
