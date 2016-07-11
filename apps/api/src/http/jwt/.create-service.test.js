const createService = require("./create-service");
const encode = require("./encode");
const moment = require("moment");
const tap = require("tap");

tap.test("http/jwt/create-service", tap => {
    const secret = "some secret here";
    const service = createService(secret);

    tap.equal(typeof service.encode, "function", "encode should exist");
    tap.equal(
        encode(secret, { tony: "hawk" }, moment("1991-04-19").valueOf()),
        service.encode({ tony: "hawk" }, moment("1991-04-19").valueOf()),
        "service should just partially apply secret"
    );

    tap.equal(typeof service.decode, "function", "decode should exist");

    tap.end();
});
