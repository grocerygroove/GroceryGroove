const decode = require("./decode");
const InvalidTokenError = require("../../errors/invalid-token-error");
const moment = require("moment");
const tap = require("tap");

tap.test("http/jwt/decode", tap => {
    tap.equal(typeof decode, "function", "function exists");

    const testSecretKey = "thisisthetestsecretkey";

    (function () {
        const expected = {
            data: {
                "user_id": 20,
            },
            "created_date": moment("1999-01-01").valueOf(),
        };
        const actual = decode(testSecretKey, moment("2000-01-01").valueOf(), "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJfaWQiOjIwfSwiY3JlYXRlZF9kYXRlIjo5MTUxNDg4MDAwMDB9.lnanC8ytzM3s7QlOKvt_KSTYjE4F8jAGV9usyyBwPH8");
        tap.strictSame(actual, expected, "correct token");
    })();

    tap.throws(
        () => decode(testSecretKey, moment("1986-11-23").valueOf(), "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJfaWQiOjIwfSwiY3JlYXRlZF9kYXRlIjo5MTUxNDg4MDAwMDB9.lnanC8ytzM3s7QlOKvt_KSTYjE4F8jAGV9usyyBwPH8"),
        InvalidTokenError,
        "throws expired InvalidTokenError"
    );

    tap.end();
});
