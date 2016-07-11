const tap = require("tap");

const a = require("../utils/asyncify");
const createJwtAuthMw = require("./create-jwt-auth");

tap.test("middleware/create-jwt-auth", a(function* (tap) {
    const jwtService = {
        decode: function (time, token) {
            return token;
        },
    };

    const logger = {
        child: function () {},
        info:  function () {},
    };

    const getTime = function(){};

    const jwtAuthMw = createJwtAuthMw(jwtService, logger, getTime);

    const ctx = {
        query: {
            token: "testtoken",
        },
        state: {},
    };

    yield jwtAuthMw(ctx, a(function* () {
        const expected = "testtoken";
        const actual = ctx.state.token;

        tap.equal(actual, expected);
    }));
}));
