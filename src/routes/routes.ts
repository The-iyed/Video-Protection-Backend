import express from 'express';

import authRoute from './auth.routes';
import { endPoint } from './endpoint';
import userRoute from './user.routes';
import videoRoute from './video.routes';

const routes = express.Router();

routes.use(endPoint.baseEndPoint, authRoute);

routes.use(endPoint.usersEndPoint, userRoute);

routes.use(endPoint.videoEndPoint , videoRoute)

export default routes;
