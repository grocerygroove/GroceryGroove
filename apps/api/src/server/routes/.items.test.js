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
            connect: (async function(){
              return {
                query: (async function ({
                  name,
                }) {
                  if (name === "items/get-item-by-name" || 
                        name === "items/create-item") {
                    let returnVal = {};
                    returnVal.rows = [
                      {
                        "item_id": 2,
                      },
                    ];
                    return returnVal;
                  } else if (name === "items/create-category-item") {
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
            connect: (async function(){
              return {
                query: (async function ({
                  name,
                }) {
                  if (name === "items/get-item-by-name" || 
                        name === "items/create-item") {
                    let returnVal = {};
                    returnVal.rows = [
                      {
                        "item_id": 3,
                      },
                    ];
                    return returnVal;
                  } else if (name === "items/create-category-item") {
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
            connect: (async function(){
              return {
                query: (async function ({
                  name,
                }) {
                  if (name === "items/get-item-by-name" || 
                        name === "items/create-item") {
                    let returnVal = {};
                    returnVal.rows = [
                      {
                        "item_id": 3,
                      },
                    ];
                    return returnVal;
                  } else if (name === "items/create-category-item") {
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
            connect: (async function(){
              return {
                query: (async function ({
                  name,
                }) {
                  if (name === "items/get-item-by-name" || 
                        name === "items/create-item") {
                    throw new DuplicateNameError();
                  } else if (name === "items/create-category-item") {
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
