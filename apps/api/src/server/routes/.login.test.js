const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/login", tap => {
  const logger = {
    info: () => {},
    child: () => logger,
  };
  const next = () => {};
  const jwtService = {
    encode: function (data) {
      return {
        data,
      };
    },
  };

  tap.test("POST /login/by-email", (async function (tap) {
    const handler = getRoute(rootGroup, "POST", "/login/by-email").handler;

    await (async function () {
      const ctx = {
        request: {
          body: {
            email: "test@test.com",
            password: "testpass",
          },
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/check-by-email") {
                return {
                  rows: [
                    {
                      "user_id": 1,
                    },
                  ]
                };
              }
              return void(0);
            }),
          },
          logger,
          jwt: jwtService,
        },
      };

      await handler(ctx, next);

      const actual = ctx.body.token.data;
      const expected = {
        "user_id": 1,
      };

      tap.strictDeepEquals(actual, expected, "Convert a valid userid to a token");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: {
            email: "test@test.com",
            password: "testpass",
          },
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/check-by-email") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
          },
          logger,
          jwt: jwtService,
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 403;

      tap.strictEqual(actual, expected, "Convert an invalid userid to an error");
    })();
  }));

  tap.test("POST /login/by-device-identifier", (async function (tap) {
    const handler = getRoute(rootGroup, "POST", "/login/by-device-identifier").handler;

    await (async function () {
      const ctx = {
        request: {
          body: {
            "device_identifier": "testdeviceid",
          },
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/check-by-device-identifier") {
                return {
                  rows: [
                    {
                      "user_id": 1,
                    },
                  ]    
                };
              }
              return void(0);
            }),
          },
          logger,
          jwt: jwtService,
        },

      };

      await handler(ctx, next);

      const actual = ctx.body.token.data;
      const expected = {
        "user_id": 1,
      };

      tap.strictDeepEquals(actual, expected, "Convert a valid deviceid to a token");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: {
            "device_identifier": "testdeviceid",
          },
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/check-by-device-identifier") {
                return {
                  rows: []
                };
              }
              return void(0);
            }),
          },
          logger,
          jwt: jwtService,
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 403;

      tap.strictEqual(actual, expected, "Convert an invalid deviceid to an error");
    })();
  }));

  tap.end();
});
