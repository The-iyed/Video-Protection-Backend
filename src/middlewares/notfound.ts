import { Request } from 'express';
import { AppError } from '../utils/appError';
import { HttpCode } from '../utils/httpCode';

const notfound = (req: Request) => {
  return new AppError(`Not Found - ${req?.originalUrl}`, HttpCode.NOT_FOUND);
};
export default notfound;
