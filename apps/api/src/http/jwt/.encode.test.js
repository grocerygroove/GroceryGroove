const jwt = require("jwt-simple");
const encode = require('./encode');
const moment = require("moment");

//Test vars
const testSecretKey = 'thisisthetestsecretkey';
const email = 'test@test.com';
const expiration_date = moment('1900-01-01');

const expectedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHBpcmF0aW9uX2RhdGUiOiJNb24gSmFuIDAxIDE5MDAgMDA6MDA6MDAgR01UKzAwMDAifQ.UietgS4B7HIHBGH2fyw1IOpgziypmImm1NS1nVkITMs';

var test = require('tape');

test('encode tests', function (t) {
    t.plan(2);

    t.equal(expectedToken, encode(testSecretKey, email, expiration_date), 'should be equal - know token vs generated token with same payload');
    t.notEqual(expectedToken, encode(testSecretKey, email), 'should not be equal - known token vs generated token with automatic expiration date');
});
