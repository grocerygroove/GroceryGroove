const cors = require("koa-cors");
const koaConvert = require("koa-convert");

module.exports = function createCors () {
    const retval = cors.bind(null, {
        origin: "*",
        methods: [
            "PUT",
            "POST",
            "GET",
            "DELETE",
            "OPTIONS",
        ],
    });

    retval.swagger = module.exports.swagger;
    return retval;
};

module.exports.swagger = {
};
