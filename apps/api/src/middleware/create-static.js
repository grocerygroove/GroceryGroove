const koaStatic = require("koa-static");

module.exports = function createStatic () {
    const retval = koaStatic(`${ __dirname }/../../public`, {
        defer: true,
    });

    retval.swagger = module.exports.swagger;
    return retval;
};

module.exports.swagger = {
};
