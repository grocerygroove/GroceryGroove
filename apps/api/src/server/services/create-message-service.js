const a = require("../../utils/asyncify");

module.exports = (client, messageQueueKey) => {
    return {
        addMessage: a(function* (message) {
            yield client.lpushAsync(messageQueueKey, message);
        }),
    };
};
