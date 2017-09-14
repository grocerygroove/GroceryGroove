const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/households", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };
  const cacher = {
    get: (key) => Promise.resolve(void(0)),
    set: (key, value) => Promise.resolve(void(0)),
    del: (key) => Promise.resolve(void(0)),
    delMulti: (keys) => Promise.resolve(void(0)),
  };
  const next = () => {};

  tap.test("GET /households", (async function (tap) {
    await (async function () {
      const handler = getRoute(rootGroup, "GET", "/households").handler;

      const ctx = {
        body: {
        },

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "households/get-household-info") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "name": "Test House",
                    "admin": "testadmin@test.com",
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          householdId: 1,
        },
      };


      await handler(ctx, next);
      const actual = ctx.body.household_info;
      const expected = {
        name: "Test House",
        admin: "testadmin@test.com",
      };

      tap.strictDeepEquals(actual, expected, "Get household on a valid household return householdInfo object");
    })();


  }));

  tap.test("POST /households", (async function (tap) {
    const handler = getRoute(rootGroup, "POST", "/households").handler;

    await (async function () {
      const ctx = {
        body: {
        },

        request: {
          body: {
            name: "Household Name",
          },
        },

        services: {
          db: {
            connect: (async function(){
              return {
                query: (async function ({
                  name,
                }) {
                  if (name === "households/create") {
                    let returnVal = {};
                    returnVal.rows = [
                      {
                        "household_id": 3,
                      },
                    ];
                    return returnVal;
                  } else if (name === "households/set-initial-user") {
                    return {
                      rows: [],
                    };
                  }
                  return void(0);
                }),
                release:() => Promise.resolve(void(0)),
              };
            }),
          },
          logger,
        },

        state: {
          userId: 1,
        },
      };


      await handler(ctx, next);

      const actual = ctx.body.household_id;
      const expected = 3;

      tap.strictEquals(actual, expected, "Successful household creation returns a body with a householdId");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        request: {
          body: {},
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "households/add-one") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "household_id": 3,
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          userId: 1,
        },

        throw: statusCode => {
          ctx.status = statusCode;
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing household name in request body results in a status of 400");
    })();
  }));

  tap.test("GET /households/users", (async function (tap) {

    await (async function () {
      const handler = getRoute(rootGroup, "GET", "/households/users").handler;
      const ctx = {
        body: {
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "households/get-users-in-household") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "user_id": 1,
                    "identifier": "test@test.com",
                  },
                  {
                    "user_id": 2,
                    "identifier": "deviceID123467",
                  },
                  {
                    "user_id": 3,
                    "identifier": "test2@test123.com",
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          userId: 1,
          householdId: 1,
        },
      };

      await handler(ctx, next);

      const actual = ctx.body.household_users;
      const expected = [
        {
          "user_id": 1,
          "identifier": "test@test.com",
        },
        {
          "user_id": 2,
          "identifier": "deviceID123467",
        },
        {
          "user_id": 3,
          "identifier": "test2@test123.com",
        },
      ];

      tap.strictDeepEquals(actual, expected, "Returns a list of user objects");
    })();
  }));

  tap.test("DELETE /households/users", (async function (tap) {
    const handler = getRoute(rootGroup, "DELETE", "/households/users").handler;

    await (async function () {
      const ctx = {
        request: {
          body: {
            "user_id": 1,
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/remove-household-user") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "deleted_count": 1,
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          userId: 1,
          householdId: 1,
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 200;

      tap.strictEquals(actual, expected, "Successful deletion results in a status of 200");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: { },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/remove-household-user") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "deleted_count": 0,
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
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

      tap.strictEquals(actual, expected, "Missing userId in request body results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: {
            "user_id": 1,
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "users/remove-household-user") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "deleted_count": 0,
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
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
      const expected = 401;

      tap.strictEquals(actual, expected, "Unsuccessful deletion results in a status of 401");
    })();
  }));

  tap.test("PUT /households/administrator", (async function (tap) {
    const handler = getRoute(rootGroup, "PUT", "/households/administrator").handler;

    await (async function () {
      const ctx = {
        request: {
          body: {
            "user_id": 1,
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "households/set-administrator") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "updated_count": 1,
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
        },

        state: {
          userId: 1,
          householdId: 1,
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 200;

      tap.strictEquals(actual, expected, "Successful promotion results in a status of 200");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: {
            "user_id": 1,
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "households/set-administrator") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "updated_count": 0,
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
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
      const expected = 401;

      tap.strictEquals(actual, expected, "Update affecting 0 rows results in a status of 401");
    })();

    await (async function () {
      const ctx = {
        request: {
          body: {},
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "households/set-administrator") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "updated_count": 0,
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
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

      tap.strictEquals(actual, expected, "Missing userId in request body results in a status of 400");
    })();
  }));

  tap.end();
});
