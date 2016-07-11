const test = require("tap").test;

const a = require("../utils/asyncify");
const createJwtAuthMw = require("./create-jwt-auth");

test("middleware/create-jwt-auth", a(function* (t) {
    const jwtService = {
        decode: function (time, token) {
            return token;
        },
    };

    const logger = {
        child: function () {},
        info:  function () {},
    };

    const getTime = function(){
        return true;
    };
    const jwtAuthMw = createJwtAuthMw(jwtService, logger, getTime);

    const expected = "testtoken";

    const actual = yield a(function* (){
        const ctx = {
            query: {
                token: "testtoken",
            },
            state: {},
        };


        return yield jwtAuthMw(ctx, a(function* () {
            return ctx.state.token;
        }));
    })();

    t.deepEqual(actual, expected);

}));
