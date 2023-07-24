import { NextFunction, Request, Response } from 'express';
import AsyncHandler from 'express-async-handler';

import axios from 'axios';
import { User } from '../database/models/user';
import { createPasswordResetToken, loginService, sendUserAndToken } from '../services/auth.service';
import { AppError } from '../utils/appError';
import Email from '../utils/email';
import { HttpCode } from '../utils/httpCode';
import crypto from 'crypto';
import sendSms from '../utils/sms';
import { createOne } from '../database/repository/user.repository';

export const login = AsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  const user = await loginService(email, password, next);
  sendUserAndToken(user as User, HttpCode.OK, res);
});

export const signup = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password, username, confirmPassword, phoneNumber } = req.body;

  const newUser = await createOne({
    email,
    password,
    username,
    confirmPassword,
    phoneNumber,
  });
  const url = `${req.protocol}://${req.get('host')}/`;
  await new Email(newUser, url).sendWelcome();
  await sendSms(phoneNumber);
  sendUserAndToken(newUser, HttpCode.CREATED, res);
});

export const forgetPassword = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    return next(new AppError('no user by this email', 404));
  }
  const { resetToken, user } = createPasswordResetToken(currentUser);
  await user.save({ validateBeforeSave: false });
  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: 200,
      data: {
        message: 'Password reset link has been sent to your email',
      },
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Please try again later', 500));
  }
});

export const resetPassword = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) return next(new AppError('invalid Token or expired token', 400));
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  sendUserAndToken(user, HttpCode.OK, res);
});

export const googleLogin = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const access_token = req.query.access_token || req.body.access_token;
  const { data } = await axios.get(process.env.EMAIL_LOGIN_ACCESS_URL as string, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const email = data.email;
  const currentEmail = email;
  const user = await User.findOne({ email: currentEmail });
  const password = process.env.DEFAULT_PASSWORD;
  const confirmPassword = process.env.DEFAULT_PASSWORD;
  const username = data.name;
  req.body = { password, confirmPassword, email, username };
  if (!user) {
    signup(req, res, next);
  } else {
    login(req, res, next);
  }
});
