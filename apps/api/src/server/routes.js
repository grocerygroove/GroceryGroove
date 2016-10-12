/* eslint-disable  global-require */
const createSwagger = require("./create-swagger");
let _swaggerObject = null;
const swaggerObject = function () {
    if (_swaggerObject == null) {
        _swaggerObject = createSwagger(module.exports);
    }
    return _swaggerObject;
};

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
                require("./routes/items"),
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
