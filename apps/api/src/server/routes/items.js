const DuplicateNameError = require("../../errors/duplicate-name-error");
const queries = require("../../db/queries");

module.exports = {
  path: "/items",

  middlewares: [
    "authJwt",
    "parseJsonBody",
    "extractHouseholdId",
    "extractUserId",
  ],

  services: [
    "db",
    "logger",
  ],

  routes: [
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
          description: "Name of item to add",
          required: true,
          type: "string",
        },
        {
          name: "description",
          in: "body",
          description: "Description of item to add",
          required: false,
          type: "string",
        },
        {
          name: "category_id",
          in: "body",
          required: true,
          type: "integer",
        },
      ],

      responses: {
        200: {},
        400: {},
      },

      handler: (async function (ctx, next) {
        const { db, logger } = ctx.services;

        const itemName = ctx.request.body.name;
        const itemDescription = ctx.request.body.description;
        const categoryId = ctx.request.body.category_id;

        if (!itemName) {
          ctx.throw(400, "Must include item 'name' in request body");
        } else if (!categoryId) {
          ctx.throw(400, "Must include 'category_id' in the request body");
        } else {
          try {
            ctx.body = {
              "item_id": await queries.items.addAndCategorizeOne(db, logger, [
                ctx.state.householdId,
                itemName,
                itemDescription,
                categoryId,
              ]),
            };
          } catch (e) {
            if (e instanceof DuplicateNameError) {
              ctx.throw(400, "Item name must be unique");
            } else {
              throw e;
            }
          }
        }
      }),
    },
  ],
};
