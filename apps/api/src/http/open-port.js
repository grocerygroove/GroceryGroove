const http = require("http");

const openPort = function (port, callback) {
    return new Promise((resolve, reject) => {
        const listener = http.createServer(callback);
        listener.on("listening", () => {
            resolve(listener);
        });
        listener.on("error", error => {
            reject(error);
        });
        listener.listen(port);
    });
};

module.exports = openPort;
