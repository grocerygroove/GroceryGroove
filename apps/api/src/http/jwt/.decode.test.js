const test = require("blue-tape");

const a = require("../../utils/asyncify");
const decode = require("./decode");
const InvalidTokenError = require("../../errors/invalid-token-error");
const moment = require("moment");

test("http/jwt/decode", a(function* (t) {
    t.equal(typeof decode, "function");

    const expected = {
        email: "test@test.com",
        created_date: moment("1999-01-01").valueOf(),
    };

    const actual = (function () {
        const testSecretKey = "thisisthetestsecretkey";
        const encodedPayload = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.bHOlRiKoIpweT4Mpk7n-2GwaK3jiPAE-2Bp6pp-ZM50";

        return decode(testSecretKey, moment("2000-01-01").valueOf(), encodedPayload);
    })();

    t.deepEqual(actual, expected, `
        should be equal - non expired token with same email, created_date,
        and encoded with same key
    `);

    t.throws(
        () => {
            const testSecretKey = "thisisthetestsecretkey";
            const encodedPayload = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.bHOlRiKoIpweT4Mpk7n-2GwaK3jiPAE-2Bp6pp-ZM50";

            return decode(testSecretKey, moment("1900-01-01").valueOf(), encodedPayload);
        },
        InvalidTokenError,
        "Should throw expired InvalidTokenError"
    );

}));
