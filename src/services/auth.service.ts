import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User } from '../database/models/user';
import { AppError } from '../utils/appError';
import { HttpCode } from '../utils/httpCode';
import { comparePassword, generateAcessToken } from '../utils/auth.utils';
import crypto from 'crypto';
import { Document, Schema } from 'mongoose';

export type token = string | undefined;
export interface requestWithUser extends Request {
  user: {
    role: string;
  };
}

export const loginService = async (email: string, currentPassword: string, next: NextFunction) => {
  if (!email || !currentPassword) {
    return new AppError('pls provide email or passsword', 404);
  }
  const user = await User.findOne({ email }).select('+password -__v');
  if (!user || !(await comparePassword(currentPassword, user.password))) {
    return next(new AppError('incorecct email or password ', HttpCode.UNAUTHORIZED));
  }

  return user;
};

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: token;

  if (req.headers?.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = jwt.verify(token as string, process.env.ACCESS_JWT_SECRET as string);
  //@ts-ignore
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('there no longer user by this id', HttpCode.UNAUTHORIZED));
  }
  //@ts-ignore
  req.user = currentUser;

  next();
});

export const restrictTo = (...role: string[]) => {
  return (req: requestWithUser, _: unknown, next: NextFunction) => {
    if (!role.includes(req.user.role)) {
      return next(new AppError(`you are not authorized to access this route`, 403));
    }
    next();
  };
};

export const createPasswordResetToken = (
  user: Document<unknown, object, User> & Omit<User & Required<{ _id: Schema.Types.ObjectId }>, never>
) => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return { resetToken, user };
};
export const sendUserAndToken = (user: User, statusCode: number, res: Response) => {
  const accessToken = generateAcessToken(user._id!);

  const jwtCookieExpiresIn = Number(process.env.JWT_ACCESS_COOKIE_EXPIRES_IN);
  const expirationTime = new Date(Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000);
  res.cookie('accessToken', accessToken, {
    expires: expirationTime,
    httpOnly: true,
    secure: true,
  });

  res.status(statusCode).json({
    status: 'success',

    accessToken,
    data: user,
  });
};
