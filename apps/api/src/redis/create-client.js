const a = require("../utils/asyncify");
const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const MESSAGE_QUEUE_KEY = 'MESSAGE_QUEUE';

module.exports = function createService (ip, port) {
    const client = redis.createClient({
        host: process.env.REDIS_IP,
        port: process.env.REDIS_PORT,
    });

    return {
        addMessage: a(function* (message) {
            yield client.lpushAsync(MESSAGE_QUEUE_KEY, message);
        }),
    };
};
