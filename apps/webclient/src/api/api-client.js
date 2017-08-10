import Swagger from 'swagger-client';

export default () => {
  return new Swagger({
    url: 'http://localhost:18080/swagger.json',
    usePromise: true,
  });
};
