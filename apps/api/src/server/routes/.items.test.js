const DuplicateNameError = require("../../errors/duplicate-name-error");
const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/items", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };
  const next = () => {};

  tap.test("POST /items", (async function (tap) {
    const handler = getRoute(rootGroup, "POST", "/items").handler;

    await (async function () {
      const ctx = {
        request: {
          body: {
            "name": "Chicken",
            "category_id": 2,
            "description": void(0),
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "items/add-and-categorize-one") {
                return {
                  rows: [
                    {
                      "item_id": 2,
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          householdId: 2,
        },
      };


      await handler(ctx, next);

      const actual = ctx.body.item_id;
      const expected = 2;

      tap.strictEquals(actual, expected, "Item insert returns itemId in response body");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: {
            "category_id": 2,
            "description": void(0),
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "items/add-and-categorize-one") {
                return {
                  rows: [
                    {
                      "item_id": 2,
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          householdId: 2,
        },

        throw: statusCode => {
          ctx.status = statusCode;
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing name in request body results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: {
            "name": "Chicken",
            "description": void(0),
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "items/add-and-categorize-one") {
                return {
                  rows: [
                    {
                      "item_id": 2,
                    },
                  ]
                };
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          householdId: 2,
        },

        throw: statusCode => {
          ctx.status = statusCode;
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing categoryId in request body results in a status of 400");
    })();


    await (async function () {
      const ctx = {
        request: {
          body: {
            "name": "Chicken",
            "category_id": 2,
            "description": void(0),
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "items/add-and-categorize-one") {
                throw new DuplicateNameError();
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          householdId: 2,
        },

        throw: statusCode => {
          ctx.status = statusCode;
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a status of 400");
    })();
  }));

  tap.end();
});
