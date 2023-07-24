import { NextFunction, Response } from 'express';
import { HttpCode } from '../utils/httpCode';
import { AppError } from './../utils/appError';
interface ErrorWithCode extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
}

interface errorProd {
  keyValue(keyValue: string): unknown;
  errors(errors: string): unknown;
  message?: string;
  name?: string;
  statusCode?: number | undefined;
  status?: string | undefined;
  isOperational?: boolean | undefined;
  code?: number | undefined;
  stack?: string | undefined;
  path?: string;
  value?: string;
}
const handleCastErrorDB = (err: errorProd) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, HttpCode.BAD_REQUEST) as ErrorWithCode;
};
const handleDuplicateFieldsDB = (err: errorProd) => {
  const message = `Duplicate field value: ${Object.keys(err.keyValue).map(
    el => el
  )}. Please use another value!`;
  return new AppError(message, HttpCode.BAD_REQUEST);
};
const handleValidationErrorDB = (err: errorProd) => {
  const errors = Object.values(err.errors).map((el: errorProd) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, HttpCode.BAD_REQUEST);
};

const handelAxiosError = () => {
  return new AppError('invalid access token', HttpCode.BAD_REQUEST);
};

const sendErrorDev = (err: ErrorWithCode, res: Response) => {
  res.status(err.statusCode || HttpCode.INTERNAL_SERVER_ERROR).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ErrorWithCode, res: Response) => {
  let error = { ...err, message: err.message, name: err?.name };
  if (error.name === 'CastError') error = handleCastErrorDB(error as errorProd);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error as errorProd);
  if (error.name === 'ValidationError')
    error = handleValidationErrorDB(error as errorProd);
  if (error.name === 'JsonWebTokenError') error = handlejWTError();
  if (error.name === 'TokenExpiredError') error = expiredJWT();
  if (error.name === 'AxiosError') error = handelAxiosError();
  if (error.isOperational) {
    res
      .status(error.statusCode || HttpCode.INTERNAL_SERVER_ERROR)
      .json({ status: error.status || 'error', message: error.message });
  } else {
    // eslint-disable-next-line no-console
    console.error('ERROR 💥', error);
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', message: 'Something went very wrong!' });
  }
};
const handlejWTError = () => {
  return new AppError('Invalid token. pls login again', HttpCode.UNAUTHORIZED);
};
const expiredJWT = () => {
  return new AppError(
    'Your token has expired! Please log in again',
    HttpCode.FORBIDDEN
  );
};
export default (
  err: ErrorWithCode,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || HttpCode.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
  next();
};
