const test = require("tape");
const moment = require("moment");

const createService = require("./create-service");

test("http/jwt/create-service:works", t => {
    t.plan(3);

    const service = createService("some secret here");
    t.equal(typeof service.encode, "function");
    t.equal(typeof service.decode, "function");

    const created_date = moment('1999-01-01').valueOf();
    const email = 'test@testertest.com';

    let actual = function(){
        const checkAgainstDate = moment('2000-01-01').valueOf();
        const encodedToken = service.encode(email, created_date);
        return service.decode(checkAgainstDate, encodedToken);
    }();

    let expected = function(){
        return {
            email,
            created_date
        };
    }();

    t.deepEqual(actual, expected);

});
