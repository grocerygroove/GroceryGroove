const exec = require('child_process').exec;
const a = require("../src/utils/asyncify");
const promiseCommand = (command) => {
    return new Promise((resolve, reject) => {
        try {
            exec(command, function(error, dOut, stderr) {
                if (error) {
                    reject(error);
                }
                resolve(dOut);
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = function resetTestingDb() {
    a(function* () {
        //Bring down the testing db
        yield promiseCommand(`../../bin/migrate downtesting`);
        //Rebuild the testing db
        yield promiseCommand(`../../bin/migrate uptesting`);

        console.log("Testing DB Reset");
    })();
};
