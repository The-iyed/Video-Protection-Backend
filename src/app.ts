import express from 'express';
import morgan from 'morgan';

import path from 'path';
import swagger from './docs/swagger';
import routes from './routes/routes';
import rateLimit from 'express-rate-limit';
import { PathParams } from 'express-serve-static-core';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import notfound from './middlewares/notfound';
import errors from './middlewares/errors';
import { AppError } from './utils/appError';
import cors from 'cors';
const app = express();

app.use(cookieParser());
swagger(app);
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '10kb' }));
app.options('*', cors());

app.use(express.static('public'));
//your inclue your field that passet as quesry to be not polluted
app.use(hpp());
app.use(compression());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use('/api/v1', routes);
app.all('*', req => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});
app.use(notfound);

app.use(errors as unknown as PathParams);
export default app;
