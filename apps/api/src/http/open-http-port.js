const http = require("http");

module.exports = function openHttpPort (port, callback) {
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
