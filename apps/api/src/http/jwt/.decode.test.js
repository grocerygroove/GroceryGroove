const test = require("tap").test;

const a = require("../../utils/asyncify");
const decode = require("./decode");
const InvalidTokenError = require("../../errors/invalid-token-error");
const moment = require("moment");

test("http/jwt/decode", a(function* (t) {
    t.equal(typeof decode, "function");

    const expected = {
        data: {
            userId : 20,
        },
        created_date: moment("1999-01-01").valueOf(),
    };

    const actual = (function () {
        const testSecretKey = "thisisthetestsecretkey";
        const encodedPayload = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJJZCI6MjB9LCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.dcTIRVp3rI54w-P5vQ_osOc-nr8Ftko0yoNSShKZ6_M";

        return decode(testSecretKey, moment("2000-01-01").valueOf(), encodedPayload);
    })();

    t.deepEqual(actual, expected, `
        should be equal - non expired token with same email, created_date,
        and encoded with same key
    `);

    t.throws(
        () => {
            const testSecretKey = "thisisthetestsecretkey";
            const encodedPayload = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJJZCI6MjB9LCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.dcTIRVp3rI54w-P5vQ_osOc-nr8Ftko0yoNSShKZ6_M";

            return decode(testSecretKey, moment("1900-01-01").valueOf(), encodedPayload);
        },
        InvalidTokenError,
        "Should throw expired InvalidTokenError"
    );

}));
