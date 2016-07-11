const bluebird = require("bluebird");

module.exports = function asyncify (generatorFunction) {
    const wrappedGenerator = bluebird.coroutine(generatorFunction);

    Object.defineProperty(wrappedGenerator, "name", {
        value: generatorFunction.name,
    });
    Object.defineProperty(wrappedGenerator, "length", {
        value: generatorFunction.length,
    });

    return wrappedGenerator;
};
