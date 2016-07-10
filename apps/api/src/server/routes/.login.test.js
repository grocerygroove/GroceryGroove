const test = require("blue-tape");

const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");

test("server/routes/login", a(function* (t) {
    t.plan(2);

    (function(){
        //Setup
        const methodToTest = getRoute(rootGroup, "POST", "/login/by-email").handler;

        let ctx = {
            request : {
                body : {
                    email : "test@test.com",
                    password : "testpass",
                }
            }
        };

        let db = {
            query : a(function*(logger, {name}){
                if(name === "users/check-by-email")
                {
                    return Promise.resolve([{ userId : 1}]);//UserId value
                }
            }),
        };

        let logger = {};
        let next = () => {};
        let jwtService = {
            encode : function({userId}){
                return {userId};
            },
        };

        methodToTest(db, jwtService, logger, ctx, next).then(()=>{
            const actual = ctx.body.token.userId;
            const expected = 1;
            t.equal(actual, expected, `
                Valid row set returned from the db, should encode the
                payload and inject in into the ctx.body.token property`);
        });
    })();

    (function(){
        //Setup
        const methodToTest = getRoute(rootGroup, "POST", "/login/by-email").handler;

        let ctx = {
            request : {
                body : {
                    email : "test@test.com",
                    password : "testpass",
                }
            }
        };

        let db = {
            query : a(function*(logger, {name}){
                if(name === "users/check-by-email")
                {
                    return Promise.resolve([]);//Empty result set array
                }
            }),
        };

        let logger = {};
        let next = () => {};
        let jwtService = {
            encode : function({userId}){
                return {userId};
            },
        };

        methodToTest(db, jwtService, logger, ctx, next).then(()=>{
            const actual = ctx.status;
            const expected = 403;
            t.equal(actual, expected, `
                If no rows are returned,
                the ctx response status should be 403`);
        });
    })();

}));
