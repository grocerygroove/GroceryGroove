const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const tap = require("tap");

tap.test("server/routes/categories", tap => {
  const logger = {
    info: () => {},
    child: () => logger,
  };
  const messenger = {
    addMessage: (message) => Promise.resolve("OK"),
  };
  const cacher = {
    get: (key) => Promise.resolve(void(0)),
    set: (key, value) => Promise.resolve(void(0)),
    del: (key) => Promise.resolve(void(0)),
    delMulti: (keys) => Promise.resolve(void(0)),
  };

  tap.test("GET /categories", (async function (tap) {
    const next = () => {};

    const handler = getRoute(rootGroup, "GET", "/categories").handler;

    const ctx = {
      services: {
        db: {
          query: (async function ({
            name,
          }) {
            if (name === "categories/get-all") {
              return {
                rows: [
                  {
                    "id": 1,
                    "name": "cleaners",
                  },
                  {
                    "id": 2,
                    "name": "produce",
                  },
                  {
                    "id": 3,
                    "name": "meats",
                  },
                  {
                    "id": 4,
                    "name": "dairy",
                  },
                ],
              };
            }
            return void(0);
          }),
        },
        logger,
        cacher,
      },

      state: {
        householdId: 1,
      },
    };


    await handler(ctx, next);

    const actual = ctx.body.categories;
    const expected = [
      {
        "id": 1,
        "name": "cleaners",
      },
      {
        "id": 2,
        "name": "produce",
      },
      {
        "id": 3,
        "name": "meats",
      },
      {
        "id": 4,
        "name": "dairy",
      },
    ];
    tap.strictDeepEquals(actual, expected, "Get list of categories");
  }));

  tap.test("POST /categories", (async function (tap) {
    const next = () => {};

    await (async function () {
      const handler = getRoute(rootGroup, "POST", "/categories").handler;

      const ctx = {
        request: {
          body: {
            name: "test category",
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "categories/add-one") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
          },
          logger,
          messenger,
          cacher,
        },

        state: {
          userId: 1,
          householdId: 1,
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 200;
      tap.strictEquals(actual, expected, "Good data inserts and returns a status of 200");
    })();

    await (async function () {
      const handler = getRoute(rootGroup, "POST", "/categories").handler;

      const ctx = {
        request: {
          body: {
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "categories/add-one") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
          },
          logger,
          messenger,
          cacher,
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        throw: statusCode => {
          ctx.status = statusCode;
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;
      tap.strictEquals(actual, expected, "Missing category name results in a 400 status");
    })();

    await (async function () {
      const handler = getRoute(rootGroup, "POST", "/categories").handler;

      const ctx = {
        request: {
          body: {
            name: "test category",
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "categories/add-one") {
                throw new DuplicateNameError();
              }
              return void(0);
            }),
          },
          logger,
          messenger,
          cacher,
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        throw: statusCode => {
          ctx.status = statusCode;
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;
      tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a 400 status");
    })();
  }));

  tap.test("GET /categories/info", (async function (tap) {
    const next = () => {};

      const handler = getRoute(rootGroup, "GET", "/categories/info").handler;

      const ctx = {
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "categories/get-all") {
                return {
                  rows: [
                    {
                      "category_id": 1,
                      "household_id": 1,
                      "name": "beans",
                    },
                    {
                      "category_id": 2,
                      "household_id": 1,
                      "name": "pork",
                    },
                    {
                      "category_id": 3,
                      "household_id": 1,
                      "name": "bleach",
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
          cacher,
        },

        state: {
          householdId: 1,
        },
      };


      await handler(ctx, next);

      const actual = ctx.body.categories;
      const expected = [
        {
          "category_id": 1,
          "household_id": 1,
          "name": "beans",
        },
        {
          "category_id": 2,
          "household_id": 1,
          "name": "pork",
        },
        {
          "category_id": 3,
          "household_id": 1,
          "name": "bleach",
        },
      ];

      tap.strictDeepEquals(actual, expected, "Get categories info");
  }));

  tap.end();
});
