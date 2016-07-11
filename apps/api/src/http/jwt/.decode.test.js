const tap = require("tap");

const a = require("../../utils/asyncify");
const decode = require("./decode");
const InvalidTokenError = require("../../errors/invalid-token-error");
const moment = require("moment");

tap.test("http/jwt/decode", a(function* (tap) {
    tap.equal(typeof decode, "function", "function exists");

    const testSecretKey = "thisisthetestsecretkey";

    (function () {
        const expected = {
            data: {
                userId : 20,
            },
            created_date: moment("1999-01-01").valueOf(),
        };
        const actual = decode(testSecretKey, moment("2000-01-01").valueOf(), "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJJZCI6MjB9LCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.dcTIRVp3rI54w-P5vQ_osOc-nr8Ftko0yoNSShKZ6_M");
        tap.strictSame(actual, expected, "correct token");
    })();

    tap.throws(
        () => decode(testSecretKey, moment("1986-11-23").valueOf(), "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJJZCI6MjB9LCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.dcTIRVp3rI54w-P5vQ_osOc-nr8Ftko0yoNSShKZ6_M"),
        InvalidTokenError,
        "throws expired InvalidTokenError"
    );

}));
