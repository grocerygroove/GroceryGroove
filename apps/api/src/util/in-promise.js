const inPromise = function (func) {
    return new Promise((resolve, reject) => {
        try {
            resolve(func());
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = inPromise;
