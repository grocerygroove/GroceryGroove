const getRoute = require("koa-group-router/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const InvalidCategoryError = require("../../errors/invalid-category-error");
const InvalidGroceryListError = require("../../errors/invalid-grocery-list-error");
const InvalidQuantityTypeError = require("../../errors/invalid-quantity-type-error");
const tap = require("tap");

tap.test("server/routes/grocery-lists", tap => {
  const logger = {
    info: () => {},
    child: () => { return logger; },
  };
  const next = () => {};

  const messenger = {
    addMessage: (message) => Promise.resolve("OK"),
  };
  const cacher = {
    get: (key) => Promise.resolve(void(0)),
    set: (key, value) => Promise.resolve(void(0)),
    del: (key) => Promise.resolve(void(0)),
  };

  tap.test("GET /grocery-lists", (async function (tap) {
    const handler = getRoute(rootGroup, "GET", "/grocery-lists").handler;

    const ctx = {
      body: {
      },

      services: {
        cacher,
        db: {
          query: (async function ({
            name,
          }) {
            if (name === "grocery-lists/get-all") {
              let returnVal = {};
              returnVal.rows = [
                {
                  "grocery_list_id": 1,
                  "created_by_id": 1,
                  "name": "Test Grocery List One",
                  "created_at": "1998-01-01",
                  "completed_at": void(0),
                  "last_touched": "1999-01-01",
                },
                {
                  "grocery_list_id": 2,
                  "created_by_id": 2,
                  "name": "Test Grocery List Two",
                  "created_at": "1999-01-01",
                  "completed_at": void(0),
                  "last_touched": "2000-01-01",
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
        userId: 1,
      },
    };


    await handler(ctx, next);

    const actual = ctx.body.grocery_lists;
    const expected = [
      {
        "grocery_list_id": 1,
        "created_by_id": 1,
        "name": "Test Grocery List One",
        "created_at": "1998-01-01",
        "completed_at": void(0),
        "last_touched": "1999-01-01",
      },
      {
        "grocery_list_id": 2,
        "created_by_id": 2,
        "name": "Test Grocery List Two",
        "created_at": "1999-01-01",
        "completed_at": void(0),
        "last_touched": "2000-01-01",
      },
    ];

    tap.strictDeepEquals(actual, expected, "Get all grocery lists");
  }));

  tap.test("GET /grocery-lists/:id", (async function (tap) {
    const handler = getRoute(rootGroup, "GET", "/grocery-lists/:id").handler;


    await (async function () {

      const ctx = {
        body: {
        },

        id: "1",

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/get-one") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "grocery_list_id": 1,
                    "created_by_id": 1,
                    "name": "Test Grocery List One",
                    "created_at": "1998-01-01",
                    "completed_at": void(0),
                    "last_touched": "1999-01-01",
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
          userId: 1,
        },
      };


      await handler(ctx, next);


      const actual = ctx.body.grocery_list;
      const expected = {
        "grocery_list_id": 1,
        "created_by_id": 1,
        "name": "Test Grocery List One",
        "created_at": "1998-01-01",
        "completed_at": void(0),
        "last_touched": "1999-01-01",
      };

      tap.strictDeepEquals(actual, expected, "Get one grocery list");
    })();

    await (async function () {

      const ctx = {
        body: {
        },

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/get-one") {
                let returnVal = {};
                returnVal = [
                  {
                    "grocery_list_id": 1,
                    "created_by_id": 1,
                    "name": "Test Grocery List One",
                    "created_at": "1998-01-01",
                    "completed_at": void(0),
                    "last_touched": "1999-01-01",
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
          userId: 1,
        },

        throw: (status) => {
          ctx.status = status;
        },
      };


      await handler(ctx, next);


      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing id results in a status of 400");
    })();

    await (async function () {

      const ctx = {
        body: {
        },

        id: "notadigit",

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/get-one") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "grocery_list_id": 1,
                    "created_by_id": 1,
                    "name": "Test Grocery List One",
                    "created_at": "1998-01-01",
                    "completed_at": void(0),
                    "last_touched": "1999-01-01",
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
          userId: 1,
        },

        throw: (status) => {
          ctx.status = status;
        },
      };


      await handler(ctx, next);


      const actual = ctx.status;
      const expected = 400;

      tap.strictDeepEquals(actual, expected, "Non digit id results in a status of 400");
    })();
  }));


  tap.test("POST /grocery-lists", (async function (tap) {
    const handler = getRoute(rootGroup, "POST", "/grocery-lists").handler;

    await (async function () {

      const ctx = {
        body: {
        },

        request: {
          body: {
            name: "Test List",
          },
        },

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/add-one") {
                let returnVal = {};
                returnVal.rows = [
                  {
                    "grocery_list_id": 1,
                  },
                ];
                return returnVal;
              } else if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
          },
          logger,
          messenger,
        },

        state: {
          householdId: 1,
          userId: 1,
        },
      };


      await handler(ctx, next);

      const actual = ctx.body.grocery_list_id;
      const expected = 1;

      tap.strictEquals(actual, expected, "Create a grocery list");
    })();

    await (async function () {

      const ctx = {
        body: {
        },

        request: {
          body: {
            name: "Test List",
          },
        },

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/add-one") {
                throw new DuplicateNameError();
              } else if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              }

              return void(0);
            }),
          },
          logger,
          messenger,
        },

        state: {
          householdId: 1,
          userId: 1,
        },

        throw: (status) => {
          ctx.status = status;
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Caught DuplicateNameError results in a status of 400");
    })();

    await (async function () {

      const ctx = {
        body: {
        },

        request: {
          body: {
            name: "Test List",
          },
        },

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/add-one") {
                return {
                  rows: [],
                };
              } else if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
          },
          logger,
          messenger,
        },

        state: {
          householdId: 1,
          userId: 1,
        },

        throw: (status) => {
          ctx.status = status;
        },
      };


      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 401;

      tap.strictEquals(actual, expected, "Empty result set results in an status of 401");
    })();
  }));

  tap.test("GET /grocery-lists/:id/items", (async function (tap) {
    const handler = getRoute(rootGroup, "GET", "/grocery-lists/:id/items").handler;
    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        id: "1",

        request: {
          body: {
          },
        },

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/items/get-all") {
                return {
                  rows: [
                    {
                      "item_id": 1,
                      "item_name": "Bread",
                      "item_description": "Grain thing",
                      "category_id": 2,
                      "category_name": "Bread/Bakery",
                      "quantity_type_id": 1,
                      "singular_name": "piece",
                      "plural_name": "pieces",
                      "singular_abbreviation": "pc",
                      "plural_abbreviation": "pcs",
                      "quantity": "1",
                      "checked": false,
                      "added_by_id": 1,
                      "added_by_nickname": "Bobbo",
                    },
                    {
                      "item_id": 2,
                      "item_name": "Milk",
                      "item_description": "Dairy stuff",
                      "category_id": 4,
                      "category_name": "Dairy",
                      "quantity_type_id": 3,
                      "singular_name": "gallon",
                      "plural_name": "gallons",
                      "singular_abbreviation": "gal",
                      "plural_abbreviation": null,
                      "quantity": "2",
                      "checked": false,
                      "added_by_id": 2,
                      "added_by_nickname": "Jerry",
                    }
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

      const actual = ctx.body.grocery_list_items;
      const expected = [
        {
          "item_id": 1,
          "item_name": "Bread",
          "item_description": "Grain thing",
          "category_id": 2,
          "category_name": "Bread/Bakery",
          "quantity_type_id": 1,
          "singular_name": "piece",
          "plural_name": "pieces",
          "singular_abbreviation": "pc",
          "plural_abbreviation": "pcs",
          "quantity": "1",
          "checked": false,
          "added_by_id": 1,
          "added_by_nickname": "Bobbo",
        },
        {
          "item_id": 2,
          "item_name": "Milk",
          "item_description": "Dairy stuff",
          "category_id": 4,
          "category_name": "Dairy",
          "quantity_type_id": 3,
          "singular_name": "gallon",
          "plural_name": "gallons",
          "singular_abbreviation": "gal",
          "plural_abbreviation": null,
          "quantity": "2",
          "checked": false,
          "added_by_id": 2,
          "added_by_nickname": "Jerry",
        }
      ];

      tap.deepEquals(actual, expected, "Get all grocery list items");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
          },
        },

        services: {
          cacher,
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/items/get-all") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
          },
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);

      const actual = ctx.status;
      const expected = 400; 
      tap.same(actual, expected, "Missing grocery list id results in a status of 400");
    })();
  }));

  tap.test("POST /grocery-lists/:id/item", (async function (tap) {
    const handler = getRoute(rootGroup, "POST", "/grocery-lists/:id/item").handler;
    const goodDb = {
      query: (async function ({
        name,
      }) {
        if (name === "grocery-lists/touch-access-log") {
          return {
            rows: [],
          };
        }
        return void(0);
      }),
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
            } else if (name === "grocery-lists/get-all") {
              return {
                rows: [
                  {
                    "grocery_list_id": 1,
                  },
                  {
                    "grocery_list_id": 2,
                  },
                  {
                    "grocery_list_id": 3,
                  },
                ],
              };
            } else if (name === "categories/get-all") {
              return {
                rows: [
                  {
                    "category_id": 1,
                  },
                  {
                    "category_id": 2,
                  },
                  {
                    "category_id": 3,
                  },
                  {
                    "category_id": 4,
                  },
                ],
              };
            } else if (name === "quantity-types/get-all") {
              return {
                rows: [
                  {
                    "quantity_type_id": 1,
                  },
                  {
                    "quantity_type_id": 2,
                  },
                  {
                    "quantity_type_id": 3,
                  },
                  {
                    "quantity_type_id": 4,
                  },
                ],
              };
            } else if (name === "grocery-lists/items/add-one") {
              return {
                rows: [
                  {
                    "grocery_list_item_id": 2,
                  },
                ],
              };
            }
            return void(0);
          }),
          release:() => Promise.resolve(void(0)),
        };
      }),
    };

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        id: "1",

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": 2,
          },
        },

        services: {
          db: goodDb,
          logger,
        },
      };


      await handler(ctx, next);

      const actual = ctx.body.grocery_list_item_id;
      const expected = 2;

      tap.strictEquals(actual, expected, "Add an item to a grocery list");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        id: "1",

        request: {
          body: {
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": 2,
          },
        },

        services: {
          db: goodDb,
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing item_name results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        id: "1",

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity": 2,
          },
        },

        services: {
          db: goodDb,
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing quantity_type_id results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        id: "1",

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": "notadigit",
            "quantity": 2,
          },
        },

        services: {
          db: goodDb,
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Invalid quantity_type_id results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        id: "1",

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
          },
        },

        services: {
          db: goodDb,
          logger,
        },

        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing quantity results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        id: "1",

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": "notadigit",
          },
        },

        services: {
          db: goodDb,
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Invalid quantity results in a status of 400");
    })();


    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": 2,
          },
        },

        services: {
          db: goodDb,
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing grocery list id in a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        id: "grocList",

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": 2,
          },
        },

        services: {
          db: goodDb,
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Invalid grocery list id results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        id: 1,

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": 2,
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
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
                  } else if (name === "grocery-lists/get-all") {
                    return {
                      rows: [
                        {
                          "grocery_list_id": 1,
                        },
                        {
                          "grocery_list_id": 2,
                        },
                        {
                          "grocery_list_id": 3,
                        },
                      ],
                    };
                  } else if (name === "categories/get-all") {
                    throw new InvalidCategoryError("here");
                  } else if (name === "quantity-types/get-all") {
                    return {
                      rows: [
                        {
                          "quantity_type_id": 1,
                        },
                        {
                          "quantity_type_id": 2,
                        },
                        {
                          "quantity_type_id": 3,
                        },
                        {
                          "quantity_type_id": 4,
                        },
                      ],
                    };
                  } else if (name === "grocery-lists/items/add-one") {
                    return {
                      rows: [
                        {
                          "grocery_list_item_id": 2,
                        },
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
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "InvalidCategoryError results in status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        id: 1,

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": 2,
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
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
                  } else if (name === "grocery-lists/get-all") {
                    return {
                      rows: [
                        {
                          "grocery_list_id": 1,
                        },
                        {
                          "grocery_list_id": 2,
                        },
                        {
                          "grocery_list_id": 3,
                        },
                      ],
                    };
                  } else if (name === "categories/get-all") {
                    throw new InvalidGroceryListError("here");
                  } else if (name === "quantity-types/get-all") {
                    return {
                      rows: [
                        {
                          "quantity_type_id": 1,
                        },
                        {
                          "quantity_type_id": 2,
                        },
                        {
                          "quantity_type_id": 3,
                        },
                        {
                          "quantity_type_id": 4,
                        },
                      ],
                    };
                  } else if (name === "grocery-lists/items/add-one") {
                    return {
                      rows: [
                        {
                          "grocery_list_item_id": 2,
                        },
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
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "InvalidGroceryListError results in status of 400");
    })();
    await (async function () {
      const ctx = {
        body: {
        },

        id: 1,

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
            "item_name": "Pop Tarts",
            "item_description": "A tasty treat.",
            "category_id": 4,
            "quantity_type_id": 1,
            "quantity": 2,
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              }
              return void(0);
            }),
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
                  } else if (name === "grocery-lists/get-all") {
                    return {
                      rows: [
                        {
                          "grocery_list_id": 1,
                        },
                        {
                          "grocery_list_id": 2,
                        },
                        {
                          "grocery_list_id": 3,
                        },
                      ],
                    };
                  } else if (name === "categories/get-all") {
                    throw new InvalidQuantityTypeError("here");
                  } else if (name === "quantity-types/get-all") {
                    return {
                      rows: [
                        {
                          "quantity_type_id": 1,
                        },
                        {
                          "quantity_type_id": 2,
                        },
                        {
                          "quantity_type_id": 3,
                        },
                        {
                          "quantity_type_id": 4,
                        },
                      ],
                    };
                  } else if (name === "grocery-lists/items/add-one") {
                    return {
                      rows: [
                        {
                          "grocery_list_item_id": 2,
                        },
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
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "InvalidQuantityTypeError results in status of 400");
    })();
  }));

  tap.test("DELETE /grocery-lists/:id/items/:itemId", (async function (tap) {
    const handler = getRoute(rootGroup, "DELETE", "/grocery-lists/:id/items/:itemId").handler;

    await (async function () {
      const ctx = {
        body: {
        },

        id: 1,
        itemId: 1,

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              } else if (name === "grocery-lists/items/remove-one") {
                return {
                  rows: [
                    {
                      "deleted_count": 1,
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 200;

      tap.strictEquals(actual, expected, "Valid delete results in a status of 200");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        id: 1,
        itemId: 1,

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              } else if (name === "grocery-lists/items/remove-one") {
                return {
                  rows: [
                    {
                      "deleted_count": 0,
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Deleted count of 0 returns a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        state: {
          userId: 1,
          householdId: 1,
        },

        itemId: 1,

        request: {
          body: {
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              } else if (name === "grocery-lists/items/remove-one") {
                return {
                  rows: [
                    {
                      "deleted_count": 0,
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing id results in a status of 400");
    })();

    await (async function () {
      const ctx = {
        body: {
        },

        id: 1,

        state: {
          userId: 1,
          householdId: 1,
        },

        request: {
          body: {
          },
        },

        services: {
          db: {
            query: (async function ({
              name,
            }) {
              if (name === "grocery-lists/touch-access-log") {
                return {
                  rows: [],
                };
              } else if (name === "grocery-lists/items/remove-one") {
                return {
                  rows: [
                    {
                      "deleted_count": 0,
                    },
                  ],
                };
              }
              return void(0);
            }),
          },
          logger,
        },
        throw: (status) => {
          ctx.status = status;
        },
      };

      await handler(ctx, next);
      const actual = ctx.status;
      const expected = 400;

      tap.strictEquals(actual, expected, "Missing grocery_list_item_id results in a status of 400");
    })();
  }));

  tap.end();
});
