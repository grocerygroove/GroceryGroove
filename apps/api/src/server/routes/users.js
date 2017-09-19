const queries = require("../../db/queries");

module.exports = {
  path: "/users",

  middlewares: [
    "authJwt",
    "parseJsonBody",
    "extractUserId",
  ],

  services: [
    "db",
    "logger",
  ],

  routes: [
    {
      method: "get",
      path: "/households",

      produces: [
        "application/json",
      ],

      responses: {
        200: {},
      },

      handler: (async function (ctx, next) {
        const { db, logger } = ctx.services;

        ctx.body = {
          households: await queries.users.getUserHouseholds(db, logger, {
            userId: ctx.state.userId,
          }),
        };
      }),
    },
    {
      method: "put",
      path: "/upgrade",

      parameters: [
        {
          name: "email",
          in: "body",
          required: true,
          type: "string",
        },
        {
          name: "password",
          in: "body",
          required: true,
          type: "string",
        },
      ],

      responses: {
        200: {},
        400: {},
      },

      handler: (async function (ctx, next) {
        const { db, logger } = ctx.services;

        const email = ctx.request.body.email;
        const password = ctx.request.body.password;

        if (!email || !password) {
          ctx.throw(400, "Must pass email and password");
        } else {
          await queries.users.convertToFullAccount(db, logger, [
            ctx.state.userId,
            email,
            password,
          ]);

          ctx.status = 200;
        }
      }),
    },
  ],
};
