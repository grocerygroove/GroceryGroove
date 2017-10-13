const queries = require("../../db/queries");

module.exports = {
  path: "/quantity-types",

  middlewares: [
    "authJwt",
  ],

  services: [
    "db",
    "logger",
  ],

  routes: [
    {
      method: "get",
      path: "/",

      produces: [
        "application/json",
      ],

      responses: {
        200: {},
      },

      handler: (async function (ctx, next) {
        const { db, logger } = ctx.services;

        ctx.body = {
          "quantity_types": await queries.quantityTypes.getAll(db, logger, {}),
        };
      }),
    },
  ],
};
