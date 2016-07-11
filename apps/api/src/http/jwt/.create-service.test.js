const test = require("tap").test;

const a = require("../../utils/asyncify");
const createService = require("./create-service");
const moment = require("moment");

test("http/jwt/create-service", a(function* (t) {
    const service = createService("some secret here");
    t.equal(typeof service.encode, "function");
    t.equal(typeof service.decode, "function");

    const created_date = moment('1999-01-01').valueOf();
    const data = {
            userId: 20,
        };

    let actual = function(){
        const checkAgainstDate = moment('2000-01-01').valueOf();
        const encodedToken = service.encode(data, created_date);
        return service.decode(checkAgainstDate, encodedToken);
    }();

    let expected = function(){
        return {
            data : {
                userId : 20,
            },
            created_date
        };
    }();

    t.deepEqual(actual, expected);
}));
