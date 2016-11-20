require('dotenv').load();
global.Promise = require("bluebird");
const redis = require("redis");
const WebSocketServer = require('ws').Server;
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

let sockets = [];

const redisSub = redis.createClient({
    host: process.env.REDIS_IP,
    port: process.env.REDIS_PORT,
});

redisSub.on("subscribe", (channel, count) => {
    console.log(`Subscribed to Channel: ${channel}`);
});

redisSub.on("message", (channel, message) => {
    console.log(`channel: ${channel}`);
    console.log(`message:${message}`);
    sockets.filter(x => x.channel === channel).forEach(x => {
        try {
            x.socket.send(message);
        } catch(e) {
            console.log(e);
        }
    });
});



const wss = new WebSocketServer({
    port: process.env.WEB_SOCKET_SERVER_PORT,
});



wss.on('connection', (ws) => {
    ws.on('message', (incoming) => {
        const incomingObject = JSON.parse(incoming);
        switch(incomingObject.action) {
            case "subscribeClient": {
                console.log(incomingObject);
                //Remove this socket if it already exists
                sockets = sockets.filter(x => x.socket!= ws);
                sockets.push({
                    channel: `household${incomingObject.householdId}`,
                    socket: ws,
                });
                console.log(sockets);
                redisSub.subscribe(`household${incomingObject.householdId}`);
                break;
            }
            case "unsubscribeClient": {
                console.log("got here");
                const channel = sockets.filter(x => x.socket === ws)[0].channel;
                //Remove this socket
                sockets = sockets.filter(x => x.socket!= ws);
                //If there are no ws with the same channel, unsubscribe to the channel
                if (sockets.filter(x => x.channel === channel).length === 0) {
                    redisSub.unsubscribe(channel);
                }
                break;
            }
        }
    });
});
