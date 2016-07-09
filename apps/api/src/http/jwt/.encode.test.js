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
        const userid = 20;
        const expectedToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOjIwLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.HJVkKobsW77CFI2zrKoAUo1pEt4XAs2FZy-fofvoM3c";

        const actual = (function(){
            const created_date = moment("1999-01-01").valueOf();

            return encode(testSecretKey, userid, created_date);
        })();

        const expected = expectedToken;

        t.equal(actual, expected, `
            should be equal - know token vs generated token with same payload
        `);
    })();

    (function () {
        const testSecretKey = "thisisthetestsecretkey";
        const userid = 20;
        const expectedToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOjIwLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.HJVkKobsW77CFI2zrKoAUo1pEt4XAs2FZy-fofvoM3c";

        const actual = encode(testSecretKey, userid);
        const expected = expectedToken;

        t.notEqual(actual, expected, `
            should not be equal - known token vs generated token with automatic
            expiration date
        `);

    })();
}));
