/* eslint-disable  global-require */
const createSwagger = require("./create-swagger");

const swaggerObject = (function () {
    let cache;
    return function () {
        if (!cache) {
            cache = createSwagger(module.exports);
        }
        return cache;
    };
})();

module.exports = {
    routes: [
        {
            middlewares: [
                "timeResponse",
                "injectServices",
                "identifyRequest",
            ],
            routes: [
                require("./routes/grocery-lists"),
                require("./routes/categories"),
                require("./routes/quantity-types"),
                require("./routes/login"),
                require("./routes/signup"),
                require("./routes/households"),
                require("./routes/users"),
            ],
        },

        {
            routes: [
                {
                    method: "get",
                    path: "/swagger.json",
                    handler: function (ctx, next) {
                        ctx.body = swaggerObject();
                        return Promise.resolve();
                    },
                    produces: [
                        "application/json",
                    ],
                    responses: {
                        200: {},
                    },
                },
            ],
        },
    ],
};
