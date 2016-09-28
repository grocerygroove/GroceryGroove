const exec = require('child_process').exec;

module.exports = function execp (command, options) {
    return new Promise((resolve, reject) => {
        try {
            exec(command, options, function(error, stdout, stderr) {
                if (error) {
                    error.stdout = stdout;
                    error.stderr = stderr;
                    reject(error);
                }
                resolve({ stdout, stderr });
            });
        } catch (e) {
            reject(e);
        }
    });
};
