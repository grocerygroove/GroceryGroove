module.exports = function inPromise (func) {
    return new Promise((resolve, reject) => {
        try {
            resolve(func());
        } catch (e) {
            reject(e);
        }
    });
};
