const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/users", tap => {

  const logger = {
    info: () => {},
    child: () => logger,
  };
  const next = () => {};

  tap.test("GET /users/households", (async function (tap) {
    const handler = getRoute(rootGroup, "GET", "/users/households").handler;

    await (async function () {
      const ctx = {
        body: {},
        state: {
          userId: 1,
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/get-user-households") {
                return {
                  rows: [
                    {
                      "household_id": 1,
                    },
                    {
                      "household_id": 2,
                    },
                    {
                      "household_id": 3,
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
        },
      };

      await handler(ctx, next);

      const actual = ctx.body.households;
      const expected = [1,2,3,];

      tap.strictDeepEquals(actual, expected, "Sets ctx.body.households to an array of results");
    })();
  }));

  tap.test("PUT /users/upgrade", (async function (tap) {
    const handler = getRoute(rootGroup, "PUT", "/users/upgrade").handler;

    await (async function () {
      const ctx = {
        state: {
          userId: 1,
        },
        request: {
          body: {
            email: "testemail@test.com",
            password: "testpassword",
          },
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/convert-to-full-account") {
                return [];
              }
              return void(0);
            }),
          },
          logger,
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 200;

      tap.strictEquals(actual, expected, "Valid put results in a status of 200");
    })();

    await (async function () {
      const ctx = {
        state: {
          userId: 1,
        },
        request: {
          body: {
            email: "testemail@test.com",
          },
        },
        throw: function (statusCode) {
          this.status = statusCode;
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/convert-to-full-account") {
                return [];
              }
              return void(0);
            }),
          },
          logger,
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing password in body results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        state: {
          userId: 1,
        },
        request: {
          body: {
            password: "testpassword",
          },
        },
        throw: function (statusCode) {
          this.status = statusCode;
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/convert-to-full-account") {
                return [];
              }
              return void(0);
            }),
          },
          logger,
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing email in body results in a status of 400");
    })();
  }));

  tap.end();
});
