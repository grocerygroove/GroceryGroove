const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const tap = require("tap");

tap.test("server/routes/signup", tap =>{
  const logger = {
    info: () => {},
    child: () => logger,
  };
  tap.test("POST /signup/by-email", (async function (tap) {
    const next = () => {};

    await (async function () {
      const handler = getRoute(rootGroup, "POST", "/signup/by-email").handler;

      const ctx = {
        request: {
          body: {
            email: "test@test.com",
            nickname: "Nicky",
            password: "testpass",
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
                        "household_id": 1,
                      },
                    ];
                    return returnVal;
                  } else if (name === "households/set-initial-user" ||
                    name === "users/set-primary-household") {
                    return {
                      rows: [],
                    };
                  } else if (name === "users/create-by-email") {
                    return {
                      rows: [
                        {
                          "user_id": 2,
                        }
                      ],
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
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 200;
      tap.strictEqual(actual, expected, "Valid user create returns 200 status");
      const actualBody = ctx.body;
      const expectedBody = {
        "userId": 2,
        "householdId": 1,
      };
      tap.strictDeepEquals(actualBody, expectedBody, "Valid user create returns expected body");
    })();

    await (async function () {
      const handler = getRoute(rootGroup, "POST", "/signup/by-email").handler;

      const ctx = {
        request: {
          body: {
            email: "test@test.com",
            nickname: "Nicky",
            password: "testpass",
          },
        },
        throw: function (statusCode) {
          this.status = statusCode;
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
                        "household_id": 1,
                      },
                    ];
                    return returnVal;
                  } else if (name === "households/set-initial-user" ||
                    name === "users/set-primary-household") {
                    return {
                      rows: [],
                    };
                  } else if (name === "users/create-by-email") {
                    throw new DuplicateNameError();
                  }
                  return void(0);
                }),
                release:() => Promise.resolve(void(0)),
              };
            }),
          },
          logger,
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;
      tap.strictEqual(actual, expected, "Catch a duplicate email and return 400 status");
    })();
  }));


  tap.test("POST /signup/by-device-identifier", (async function (tap) {
    const next = () => {};

    await (async function () {
      const handler = getRoute(rootGroup, "POST", "/signup/by-device-identifier").handler;

      const ctx = {
        request: {
          body: {
            "device_identifier": "testIdentifier12356",
            "nickname": "Nicky",
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
                        "household_id": 1,
                      },
                    ];
                    return returnVal;
                  } else if (name === "households/set-initial-user" ||
                    name === "users/set-primary-household") {
                    return {
                      rows: [],
                    };
                  } else if (name === "users/create-by-device-identifier") {
                    return {
                      rows: [
                        {
                          "user_id": 2,
                        }
                      ],
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
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 200;
      tap.strictEqual(actual, expected, "Valid device id create returns 200 status");
      const actualBody = ctx.body;
      const expectedBody = {
        userId: 2,
        householdId: 1,
      };
      tap.strictDeepEquals(actualBody, expectedBody, "Valid device id create returns expected body");
    })();

    await (async function () {
      const handler = getRoute(rootGroup, "POST", "/signup/by-device-identifier").handler;

      const ctx = {
        request: {
          body: {
            "device_identifier": "testIdentifier12356",
            "nickname": "Nicky",
          },
        },
        throw: function (statusCode) {
          this.status = statusCode;
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
                        "household_id": 1,
                      },
                    ];
                    return returnVal;
                  } else if (name === "households/set-initial-user" ||
                    name === "users/set-primary-household") {
                    return {
                      rows: [],
                    };
                  } else if (name === "users/create-by-device-identifier") {
                    throw new DuplicateNameError();
                  }
                  return void(0);
                }),
                release:() => Promise.resolve(void(0)),
              };
            }),
          },
          logger,
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;
      tap.strictEqual(actual, expected, "Catch a duplicate device identifier and return 400 status");
    })();
  }));

  tap.end();
});
