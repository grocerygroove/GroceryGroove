const encode = require("./encode");
const jwt = require("jwt-simple");
const moment = require("moment");
const tap = require("tap");

tap.test("http/jwt/encode", tap => {
    tap.equal(typeof encode, "function", "function exists");

    const testSecretKey = "thisisthetestsecretkey";
    const data = {
        "user_id": 20,
    };
    const actual = encode(testSecretKey, data, moment("1999-01-01").valueOf());
    const expected = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InVzZXJfaWQiOjIwfSwiY3JlYXRlZF9kYXRlIjo5MTUxNDg4MDAwMDB9.lnanC8ytzM3s7QlOKvt_KSTYjE4F8jAGV9usyyBwPH8";

    tap.equal(actual, expected, "correct token");

    tap.end();
});
