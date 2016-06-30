const test = require('tape');

const decode = require('./decode');
const moment = require('moment');
const InvalidTokenError = require("../../errors/invalid-token-error");



test('decode tests', function (t) {

    t.plan(3);

    t.equal(typeof decode, "function");

    const expected = {
        email: 'test@test.com',
        created_date: moment('1999-01-01').valueOf(),
    };

    const actual = (function () {
        const testSecretKey = 'thisisthetestsecretkey';
        const encodedPayload = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.bHOlRiKoIpweT4Mpk7n-2GwaK3jiPAE-2Bp6pp-ZM50';

        return decode(testSecretKey, moment('2000-01-01').valueOf(), encodedPayload);
    })();

    t.deepEqual(actual, expected, `
        should be equal - non expired token with same email, created_date,
        and encoded with same key
    `);

    const functionThatThrows = function(){
       const testSecretKey = 'thisisthetestsecretkey';
       const encodedPayload = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.bHOlRiKoIpweT4Mpk7n-2GwaK3jiPAE-2Bp6pp-ZM50';

       return decode(testSecretKey, moment('1900-01-01').valueOf(), encodedPayload);
    };
    t.throws(() => functionThatThrows(), InvalidTokenError, 'Should throw expired InvalidTokenError');

});
