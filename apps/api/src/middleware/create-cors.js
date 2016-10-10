const cors = require("koa-cors");

module.exports = function createCors () {
    const retval = cors({
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
};

module.exports.swagger = {
};
