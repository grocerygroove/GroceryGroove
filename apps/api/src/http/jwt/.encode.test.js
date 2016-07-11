const encode = require("./encode");
const jwt = require("jwt-simple");
const moment = require("moment");
const tap = require("tap");

tap.test("http/jwt/encode", tap => {
    tap.equal(typeof encode, "function", "function exists");

    const testSecretKey = "thisisthetestsecretkey";
    const data = {
        userId: 20,
    };
    const actual = encode(testSecretKey, data, moment("1999-01-01").valueOf());
    const expected = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJJZCI6MjB9LCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.dcTIRVp3rI54w-P5vQ_osOc-nr8Ftko0yoNSShKZ6_M";

    tap.equal(actual, expected, "correct token");

    tap.end();
});
