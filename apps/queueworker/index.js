require('dotenv').load();
global.Promise = require("bluebird");
const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const messageQueueKey = process.env.REDIS_MESSAGE_QUEUE_NAME;

const redisClient = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
});
const redisPub = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
});

const workQueue = () => {
    return redisClient.rpopAsync(messageQueueKey).then(
        item => {
            if (item) {
                const [ ,, householdId,, message ] = /^(household[:]['])(\d+)([']\s)([\w\s]+)$/.exec(item);
                redisPub.publish(`household${householdId}`, message);
            }
        }
    )
    .then(() => {
        return workQueue();
    });
};

workQueue();
