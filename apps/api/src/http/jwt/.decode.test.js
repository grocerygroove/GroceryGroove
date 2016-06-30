const jwt = require("jwt-simple");
const decode = require('./decode');
const moment = require('moment');

const testSecretKey = 'thisisthetestsecretkey';
const email = 'test@test.com';
const expiration_date = moment('1999-01-01').valueOf();
//console.log(expiration_date);

//console.log(encode(testSecretKey, email, expiration_date));

const payload = {
    email,
    expiration_date,
};

const encodedPayload = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHBpcmF0aW9uX2RhdGUiOiI5MTUxNDg4MDAwMDAifQ.Q137N2l3sPObNhWaWoUDQAXLsX3xZr9qos7bcTGtA2k';

var test = require('tape');

test('decode tests', function (t) {
    t.plan(1);
    t.equal(payload,
            decode(testSecretKey,
                   moment('1998-01-01').valueOf(),
                   encodedPayload),
            'should be equal - non expired token with same email, expiration_date, and encoded with same key');

});
