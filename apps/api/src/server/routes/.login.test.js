const test = require("blue-tape");

const a = require("../../utils/asyncify");
const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");

test("server/routes/login", a(function* (t){

    t.plan(1);

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
            query : function(logger, {name}){
                if(name === "checkByEmail")
                {
                    return Promise.resolve(1);//UserId value
                }
            },
        };

        let logger = {};
        let next = () => {};
        let jwtService = {
            encode : function({userId}){
                return {userId};
            },
        }
        methodToTest(db, jwtService, logger, ctx, next).then(()=>{
            t.equals(ctx.body.token.userId, 1);
        });
    })();

}));
