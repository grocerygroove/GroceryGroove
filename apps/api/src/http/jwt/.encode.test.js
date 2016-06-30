const jwt = require("jwt-simple");
const encode = require('./encode');
const moment = require("moment");

//Test vars


var test = require('tape');

test('encode tests', function (t) {
    t.plan(3);

    //Shared vars
    const testSecretKey = 'thisisthetestsecretkey';
    const email = 'test@test.com';
    const expectedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJjcmVhdGVkX2RhdGUiOjkxNTE0ODgwMDAwMH0.bHOlRiKoIpweT4Mpk7n-2GwaK3jiPAE-2Bp6pp-ZM50';

    const test1Actual = function(){
        const created_date = moment('1999-01-01').valueOf();

        return encode(testSecretKey, email, created_date);
    }();

    const test1Expected = function(){
        return expectedToken;
    }();
    t.equal(test1Actual, test1Expected, `
        should be equal - know token vs generated token
        with same payload
    `);

    const test2Actual = function(){
        return encode(testSecretKey, email);
    }();
    const test2Expected = function(){
        return expectedToken;
    }();
    t.notEqual(test2Actual, test2Expected, `
        should not be equal - known token vs generated token with
        automatic expiration date
    `);

    t.equal(typeof encode, "function");
});
