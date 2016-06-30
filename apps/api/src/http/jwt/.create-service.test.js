const test = require("tape");

const createService = require("./create-service");

test("http/jwt/create-service:works", t => {
    t.plan(2);

    const service = createService("some secret here");
    t.equal(typeof service.encode, "function");
    t.equal(typeof service.decode, "function");
});
