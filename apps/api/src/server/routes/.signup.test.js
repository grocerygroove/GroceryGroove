const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");
const tap = require("tap");

tap.test("server/routes/signup", tap =>{
    tap.test("POST /signup/by-email", a(function* (tap) {
        const logger = {};
        const next = () => {};

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/signup/by-email").handler;

            const ctx = {
                request: {
                    body: {
                        email: "test@test.com",
                        password: "testpass",
                    }
                }
            };

            const db = {
                query: a(function* (logger, {
                    name,
                })  {
                    if(name === "users/create-user-and-household-by-email") {
                        return [];
                    }
                }),
            };

            yield handler(db, logger, ctx, next);
            
            const actual = ctx.status;
            const expected = 200;
            tap.strictEqual(actual, expected, "Valid email insert returns 200 status");
        })();

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/signup/by-email").handler;

            const ctx = {
                request: {
                    body: {
                        email: "test@test.com",
                        password: "testpass",
                    }
                },
                throw: function (statusCode) {
                    this.status = statusCode;
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if(name === "users/create-user-and-household-by-email") {
                        throw new DuplicateNameError();
                    }
                }),
            };

            yield handler(db, logger, ctx, next);
            
            const actual = ctx.status;
            const expected = 400;
            tap.strictEqual(actual, expected, "Catch a duplicate email and return 400 status");
        })();
    }));


    tap.test("POST /signup/by-device-identifier", a(function* (tap) {
        const logger = {};
        const next = () => {};

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/signup/by-device-identifier").handler;

            const ctx = {
                request: {
                    body : {
                        deviceIdentifier: "testIdentifier12356",
                    }
                },
            };

            const db = {
                query: a(function* (logger, {
                    name,
                }) {
                    if(name === "users/create-user-and-household-by-device-identifier"){
                        return [];
                    }
                }),
            };

            yield handler(db, logger, ctx, next);
            
            const actual = ctx.status;
            const expected = 200;
            tap.strictEqual(actual, expected, "Valid device id insert returns 200 status");
        })();

        yield a(function* () {
            const handler = getRoute(rootGroup, "POST", "/signup/by-device-identifier").handler;

            const ctx = {
                request: {
                    body : {
                        deviceIdentifier: "testIdentifier12356",
                    }
                },
                throw: function (statusCode) {
                    this.status = statusCode;
                },
            };

            const db = {
                query: a(function* (logger, {
                   name,
                })  {
                    if(name === "users/create-user-and-household-by-device-identifier") {
                        throw new DuplicateNameError();
                    }
                }),
            };

            yield handler(db, logger, ctx, next);
            
            const actual = ctx.status;
            const expected = 400;
            tap.strictEqual(actual, expected, "Catch a duplicate device identifier and return 400 status");
        })();
    }));

    tap.end();
});
