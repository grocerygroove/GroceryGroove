const jwt = require("jwt-simple");
const encode = require('./encode');
const moment = require("moment");

//Test vars


var test = require('tape');

test('encode tests', function (t) {
    t.plan(3);

    t.equal(typeof encode, "function");

    (function () {
        const testSecretKey = 'thisisthetestsecretkey';
        const email = 'test@test.com';
        const expectedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.bHOlRiKoIpweT4Mpk7n-2GwaK3jiPAE-2Bp6pp-ZM50';

        const actual = (function(){
            const created_date = moment('1999-01-01').valueOf();

            return encode(testSecretKey, email, created_date);
        })();

        const expected = expectedToken;

        t.equal(actual, expected, `
            should be equal - know token vs generated token with same payload
        `);
    })();

    (function () {
        const testSecretKey = 'thisisthetestsecretkey';
        const email = 'test@test.com';
        const expectedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.bHOlRiKoIpweT4Mpk7n-2GwaK3jiPAE-2Bp6pp-ZM50';

        const actual = encode(testSecretKey, email);
        const expected = expectedToken;

        t.notEqual(actual, expected, `
            should not be equal - known token vs generated token with automatic
            expiration date
        `);

    })();
});
