const a = require("../../utils/asyncify");

const MESSAGE_QUEUE_KEY = 'MESSAGE_QUEUE';

module.exports = (client) => {
    return {
        addMessage: a(function* (message) {
            yield client.lpushAsync(MESSAGE_QUEUE_KEY, message);
        }),
    };
};
