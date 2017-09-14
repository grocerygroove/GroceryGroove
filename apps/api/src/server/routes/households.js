const queries = require("../../db/queries");
const transactions = require("../../db/transactions");
const cacheKeys = {
  getHouseholdKey: (householdId) => {
    return `getHousehold${householdId}`;
  },
};

module.exports = {
  path: "/households",

  middlewares: [
    "authJwt",
    "parseJsonBody",
    "extractHouseholdId",
    "extractUserId",
  ],

  services: [
    "cacher",
    "db",
    "logger",
    "messenger",
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
        const { db, logger, cacher } = ctx.services;
        const householdId = ctx.state.householdId;

        let response;
        const cacheKey = cacheKeys.getHouseholdKey(householdId);
        const cachedResult = await cacher.get(cacheKey);
        if (cachedResult) {
          response = cachedResult;
        } else {
          response = {
            "household_info": await queries.households.getHouseholdInfo(db, logger, {
              householdId,
            }),
          };
          await cacher.set(cacheKey, response);
        }
        ctx.body = response;
      }),
    },
    {
      method: "post",
      path: "/",

      produces: [
        "application/json",
      ],

      parameters: [
        {
          name: "name",
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

        const householdName = ctx.request.body.name;
        if (!householdName) {
          ctx.throw(400, "Must include household name in request body");
        } else {
          ctx.body = {
            "household_id": (await transactions.households.createForUser(db, logger, {
              householdName,
              userId: ctx.state.userId,
            })),
          };
        }
      }),
    },
    {
      method: "get",
      path: "/users",

      produces: [
        "application/json",
      ],

      responses: {
        200: {},
      },

      handler: (async function (ctx, next) {
        const { db, logger } = ctx.services;

        const userId = ctx.state.userId;
        const householdId = ctx.state.householdId;
        ctx.body = {
          "household_users": await queries.households.getUsersInHousehold(db, logger, {
            userId,
            householdId,
          }),
        };
      }),
    },
    {
      method: "delete",
      path: "/users",

      parameters: [
        {
          name: "user_id",
          in: "body",
          description: "UserId to remove",
          required: true,
          type: "string",
        },
      ],

      responses: {
        200: {},
        400: {},
        401: {},
      },

      handler: (async function (ctx, next) {
        const { db, logger } = ctx.services;

        const userToRemove = ctx.request.body.user_id;
        if (!userToRemove) {
          ctx.throw(400, "Must include userId in request body");
        } else {
          const affected = await queries.users.removeHouseholdUser(db, logger, {
            userId: ctx.state.userId,
            userIdToDelete: userToRemove,
            householdId: ctx.state.householdId,
          });

          if (affected && affected > 0) {
            ctx.status = 200;
          } else {
            ctx.throw(401, "User lacks permissions to perform deletion");
          }
        }
      }),
    },
    {
      method: "put",
      path: "/administrator",

      parameters: [
        {
          name: "user_id",
          in: "body",
          description: "UserId to remove",
          required: true,
          type: "string",
        },
      ],

      responses: {
        200: {},
        400: {},
        401: {},
      },

      handler: (async function (ctx, next) {
        const { db, logger } = ctx.services;

        const userToPromote = ctx.request.body.user_id;
        if (!userToPromote) {
          ctx.throw(400, "Must include userId in request body");
        } else {
          const affected = await queries.households.setAdministrator(db, logger, {
            userId: ctx.state.userId,
            userToPromote,
            householdId: ctx.state.householdId,
          });

          if (affected && affected === 1) {
            ctx.status = 200;
          } else {
            ctx.throw(401, "User lacks permissions to perform promotion");
          }
        }
      }),
    },
  ],
};
