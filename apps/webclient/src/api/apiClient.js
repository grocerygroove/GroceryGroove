var Swagger = require('swagger-client');

module.exports = () => {
    return new Swagger({
        url: 'http://localhost:18080/swagger.json',
        usePromise: true,
    });
};
