const a = require("../utils/asyncify");
const createJwtAuthMw = require("./create-jwt-auth");
const test = require('blue-tape');


test('middleware/create-jwt-auth', a(function* (t) {
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

    const expected = {
        token: 'testtoken',
    };

    const actual = yield a(function* (){
        const ctx = {
            query: {
                token: 'testtoken',
            },
            state: {},
        };

        yield jwtAuthMw(ctx, () => {});
        return ctx.state.token;
    })();

    t.deepEqual(actual, expected);

});
