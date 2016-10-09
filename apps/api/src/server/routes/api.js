const a = require("../../utils/asyncify");
const execp = require("../../utils/execp");


module.exports = {
    path: "/api",

    middlewares: [],
    deps: [],
    routes: [
        {
            method: "get",
            path: "/",

            produces: [
                "application/json",
            ],

            parameters: [],

            responses: {
                200: {},
            },

            handler: a(function* (ctx, next) {
                const value = yield execp(`node /opt/api/bin/create-swagger-json.js`);
                ctx.body = value.stdout;
            }),
        },
    ],
};
