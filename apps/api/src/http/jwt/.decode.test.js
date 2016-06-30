const test = require('tape');

const decode = require('./decode');
const moment = require('moment');



test('decode tests', function (t) {

    const expected = {
        email: 'test@test.com',
        expiration_date: moment('1999-01-01').valueOf(),
    };

    const actual = (function () {
        const testSecretKey = 'thisisthetestsecretkey';
        const encodedPayload = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHBpcmF0aW9uX2RhdGUiOiI5MTUxNDg4MDAwMDAifQ.Q137N2l3sPObNhWaWoUDQAXLsX3xZr9qos7bcTGtA2k';

        return decode(testSecretKey, moment('1998-01-01').valueOf(), encodedPayload)
    })();


    t.plan(1);
    t.deepEqual(actual, expected, `
        should be equal - non expired token with same email, expiration_date,
        and encoded with same key
    `);

});
