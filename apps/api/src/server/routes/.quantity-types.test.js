const DuplicateNameError = require("../../errors/duplicate-name-error");
const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const tap = require("tap");

tap.test("server/routes/quantity-types", tap => {
  const logger = {
    info: () => {},
    child: () => logger,
  };
  const next = () => {};

  tap.test("GET /quantity-types", (async function (tap) {

    await (async function () {
      const handler = getRoute(rootGroup, "GET", "/quantity-types").handler;
      const ctx = {
        state: {
          userId: 1,
          householdId: 1,
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "quantity-types/get-all") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "quantity_type_id": 1,
                    "singular_name": "piece",
                    "plural_name": "pieces",
                    "singular_abbreviation": "pc",
                    "plural_abbreviation": "pcs",
                    "household_id": void(0),
                  },
                  {
                    "quantity_type_id": 2,
                    "singular_name": "cup",
                    "plural_name": "cups",
                    "singular_abbreviation": void(0),
                    "plural_abbreviation": void(0),
                    "household_id": void(0),
                  },
                  {
                    "quantity_type_id": 3,
                    "singular_name": "gallon",
                    "plural_name": "gallons",
                    "singular_abbreviation": "gal",
                    "plural_abbreviation": void(0),
                    "household_id": void(0),
                  },
                ];
                return returnVal;
              }
              return void(0);
            }),
          },
          logger,
        },
      };

      await handler(ctx, next);

      const actual = ctx.body.quantity_types;
      const expected = [
        {
          "quantity_type_id": 1,
          "singular_name": "piece",
          "plural_name": "pieces",
          "singular_abbreviation": "pc",
          "plural_abbreviation": "pcs",
          "household_id": void(0),
        },
        {
          "quantity_type_id": 2,
          "singular_name": "cup",
          "plural_name": "cups",
          "singular_abbreviation": void(0),
          "plural_abbreviation": void(0),
          "household_id": void(0),
        },
        {
          "quantity_type_id": 3,
          "singular_name": "gallon",
          "plural_name": "gallons",
          "singular_abbreviation": "gal",
          "plural_abbreviation": void(0),
          "household_id": void(0),
        },
      ];

      tap.strictDeepEquals(actual, expected, "Get quantity types");
    })();
  }));

  tap.test("POST /quantity-types", (async function (tap) {
    const handler = getRoute(rootGroup, "POST", "/quantity-types").handler;

    await (async function () {
      const ctx = {
        state: {
          householdId: 1,
        },
        request: {
          body: {
            "singular_name": "ounce",
            "plural_name": "ounces",
            "singular_abbreviation": "oz",
            "plural_abbreviation": void(0),
          },
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "quantity-types/add-one") {
                return {
                  rows: [],
                };
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

      tap.strictEquals(actual, expected, "Good data inserts and returns a status of 200");

    })();

    await (async function () {
      const ctx = {
        state: {
          householdId: 1,
        },
        request: {
          body: {
            "plural_name": "ounces",
            "singular_abbreviation": "oz",
            "plural_abbreviation": void(0),
          },
        },
        throw: statusCode => {
          ctx.status = statusCode;
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "quantity-types/add-one") {
                return {
                  rows: [],
                };
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

      tap.strictEquals(actual, expected, "Missing singular_name results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        state: {
          householdId: 1,
        },
        request: {
          body: {
            "singular_name": "ounce",
            "plural_name": "ounces",
            "singular_abbreviation": "oz",
            "plural_abbreviation": void(0),
          },
        },
        throw: statusCode => {
          ctx.status = statusCode;
        },
        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "quantity-types/add-one") {
                throw new DuplicateNameError();
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

      tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a 400 status");
    })();
  }));

  tap.end();
});
