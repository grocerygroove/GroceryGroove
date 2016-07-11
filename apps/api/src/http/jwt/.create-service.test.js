const tap = require("tap");

const a = require("../../utils/asyncify");
const createService = require("./create-service");
const moment = require("moment");

tap.test("http/jwt/create-service", tap => {
    const service = createService("some secret here");

    tap.equal(typeof service.encode, "function", "encode should exist");
    tap.equal(typeof service.decode, "function", "decode should exist");

    tap.end();
});
