//setup
const db = {
    client : function () {
        return true;
    }
};
const jwt = require("../../http/jwt/create-service")(process.env.JWTSECRET);
const jsonBodyParser = require('body-parser');
const logger = {
    child: function(){
        return true;
    }
};
const fakeServices = {
    db,
    jwt,
    jsonBodyParser,
    logger
};


const testEmail = 'test@email.com';
const testPassword = 'testpass';

const loginRouter = require('./login')(fakeServices);
let req = {
    url: '/',
    method: 'GET',
    body: {
        email : testEmail,
        password : testPassword
    },
};
let res = {
    end : function(){}
};

//Call the route
loginRouter.handle(req, res);

const responseToken = res.json.token;
const expectedToken = jwt.encode(testEmail);


//Tests
var test = require('tape');

test('Login Test', function (t) {
    t.plan(1);

    t.equal(expectedToken, responseToken);
});
