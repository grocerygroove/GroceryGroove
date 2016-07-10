const test = require("blue-tape");

const a = require("../../utils/asyncify");
const encode = require("./encode");
const jwt = require("jwt-simple");
const moment = require("moment");

test("http/jwt/encode", a(function* (t) {
    t.plan(3);

    t.equal(typeof encode, "function");

    (function () {
        const testSecretKey = "thisisthetestsecretkey";
        const data = {
            userId: 20,
        };
        const expectedToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJJZCI6MjB9LCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.dcTIRVp3rI54w-P5vQ_osOc-nr8Ftko0yoNSShKZ6_M";

        const actual = (function(){
            const created_date = moment("1999-01-01").valueOf();

            return encode(testSecretKey, data, created_date);
        })();

        const expected = expectedToken;

        t.equal(actual, expected, `
            should be equal - know token vs generated token with same payload
        `);
    })();

    (function () {
        const testSecretKey = "thisisthetestsecretkey";
        const data = {
            userId: 20,
        };
        const expectedToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJJZCI6MjB9LCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.dcTIRVp3rI54w-P5vQ_osOc-nr8Ftko0yoNSShKZ6_M";

        const actual = encode(testSecretKey, data);
        const expected = expectedToken;

        t.notEqual(actual, expected, `
            should not be equal - known token vs generated token with automatic
            expiration date
        `);

    })();
}));
