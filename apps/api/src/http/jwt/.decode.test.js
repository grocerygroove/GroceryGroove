const test = require("blue-tape");

const a = require("../../utils/asyncify");
const decode = require("./decode");
const InvalidTokenError = require("../../errors/invalid-token-error");
const moment = require("moment");

test("http/jwt/decode", a(function* (t) {
    t.equal(typeof decode, "function");

    const expected = {
        userid: 20,
        created_date: moment("1999-01-01").valueOf(),
    };

    const actual = (function () {
        const testSecretKey = "thisisthetestsecretkey";
        const encodedPayload = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOjIwLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.HJVkKobsW77CFI2zrKoAUo1pEt4XAs2FZy-fofvoM3c";

        return decode(testSecretKey, moment("2000-01-01").valueOf(), encodedPayload);
    })();

    t.deepEqual(actual, expected, `
        should be equal - non expired token with same email, created_date,
        and encoded with same key
    `);

    t.throws(
        () => {
            const testSecretKey = "thisisthetestsecretkey";
            const encodedPayload = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOjIwLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.HJVkKobsW77CFI2zrKoAUo1pEt4XAs2FZy-fofvoM3c";

            return decode(testSecretKey, moment("1900-01-01").valueOf(), encodedPayload);
        },
        InvalidTokenError,
        "Should throw expired InvalidTokenError"
    );

}));
