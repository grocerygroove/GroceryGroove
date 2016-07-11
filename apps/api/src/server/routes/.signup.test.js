const test = require("blue-tape");

const getRoute = require("../route-tools/get-route");
const rootGroup = require("../routes");
const DuplicateNameError = require("../../errors/duplicate-name-error");

test("server/routes/signup", (function (t) {
    t.plan(4);

    //Check to make sure with a valid insert, we return a 200 status code
    (function(){
        //Setup
        const methodToTest = getRoute(rootGroup, "POST", "/signup/by-email").handler;

        let ctx = {
            request : {
                body : {
                    email : "test@test.com",
                    password : "testpass",
                }
            }
        };

        let db = {
            query : function (logger, {name}){
                if(name === "users/create-user-and-household-by-email")
                {
                    return Promise.resolve([]);//Empty array
                }
            },
        };

        let logger = {};
        let next = () => {};

        methodToTest(db, logger, ctx, next).then(()=>{
            const actual = ctx.status;
            const expected = 200;
            t.equal(actual, expected, `
                Email - Valid row set returned from the db, should
                return a status code of 200`);
        });
    })();

    //If the db throws a DuplicateNameError, we should catch that and return a status code of 400
    (function(){
        //Setup
        const methodToTest = getRoute(rootGroup, "POST", "/signup/by-email").handler;

        let ctx = {
            request : {
                body : {
                    email : "test@test.com",
                    password : "testpass",
                }
            },
            throw : function(statusCode){
                this.status = statusCode;
            },
        };

        let db = {
            query : function (logger, {name}){
                if(name === "users/create-user-and-household-by-email")
                {
                    throw new DuplicateNameError();
                }
            },
        };

        let logger = {};
        let next = () => {};

        methodToTest(db, logger, ctx, next).then(()=>{
            const actual = ctx.status;
            const expected = 400;
            t.equal(actual, expected, `
                Email - With a duplicate email insert, we will throw a
                DuplicateNameError. This should be caught and return
                a status of 400`);
        });
    })();


    //Check to make sure with a valid insert, we return a 200 status code
    (function(){
        //Setup
        const methodToTest = getRoute(rootGroup, "POST", "/signup/by-device-identifier").handler;

        let ctx = {
            request : {
                body : {
                    deviceIdentifier : "testIdentifier12356",
                }
            }
        };

        let db = {
            query : function (logger, {name}){
                if(name === "users/create-user-and-household-by-device-identifier")
                {
                    return Promise.resolve([]);//Empty array
                }
            },
        };

        let logger = {};
        let next = () => {};

        methodToTest(db, logger, ctx, next).then(()=>{
            const actual = ctx.status;
            const expected = 200;
            t.equal(actual, expected, `
                DeviceIdentifier - Valid row set returned from the db, should
                return a status code of 200`);
        });
    })();

    //If the db throws a DuplicateNameError, we should catch that and return a status code of 400
    (function(){
        //Setup
        const methodToTest = getRoute(rootGroup, "POST", "/signup/by-device-identifier").handler;

        let ctx = {
            request : {
                body : {
                    deviceIdentifier : "testIdentifier12356",
                }
            },
            throw : function(statusCode){
                this.status = statusCode;
            },
        };

        let db = {
            query : function (logger, {name}){
                if(name === "users/create-user-and-household-by-device-identifier")
                {
                    throw new DuplicateNameError();
                }
            },
        };

        let logger = {};
        let next = () => {};

        methodToTest(db, logger, ctx, next).then(()=>{
            const actual = ctx.status;
            const expected = 400;
            t.equal(actual, expected, `
                DeviceIdentifier - With a duplicate device identifier insert, we will throw a
                DuplicateNameError. This should be caught and return
                a status of 400`);
        });
    })();

}));
