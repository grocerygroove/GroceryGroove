const test = require('tape');

test('create-jwt-auth-mw tests', function(t){

    t.plan(1);

    //Create mock objects
    const jwtService = {
        decode : function(time, token){
            return token;
        }
    };
    const logger = {
        child : function(){
            return true;
        },
        info : function(err){},
    };
    const getTime = function(){
        return true;
    };

    const jwtAuthMw = require('./create-jwt-auth-mw')(jwtService, logger, getTime);

    const actual1 = function(){
        let req = {
            query : {
                token : 'testtoken',
            },
        };
        const res = {};
        const next = () => {};

        //Call the method which should modify the req.token value...return the req?
        jwtAuthMw(req, res, next);
        return req;
    }();

    const expected1 = {
        query : {
            token : 'testtoken',
        },
        token : 'testtoken',
    };

    t.deepEqual(actual1, expected1);

});
