import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import swaggerDocument from './swaggerDocs.json';
import { endPoint } from '../routes/endpoint';

const swagger = (app: Express): void => {
  console.log(`the documentations in  http://localhost:4000${endPoint.swaggerEndPoint}`);
  app.use(endPoint.swaggerEndPoint, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default swagger;
