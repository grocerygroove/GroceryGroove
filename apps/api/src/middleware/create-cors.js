const cors = require("koa-cors");
const koaConvert = require("koa-convert");

module.exports = function createCors () {
    const retval = koaConvert(cors({
        origin: "*",
        methods: [
            "PUT",
            "POST",
            "GET",
            "DELETE",
            "OPTIONS",
        ],
    }));

    retval.swagger = module.exports.swagger;
};

module.exports.swagger = {
};
