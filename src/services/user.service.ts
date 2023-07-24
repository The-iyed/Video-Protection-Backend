import opationAll, { getAll } from '../database/repository/user.repository';
import { Request, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
//import { requestWithUser } from './auth.service';
import { AppError } from '../utils/appError';

export const getAllUsers = async (options: opationAll) => {
  return await getAll(options);
};
const multerStorage = multer.memoryStorage();

const multerFilter = (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (process.env.NODE_ENV === 'production' && file.mimetype.startsWith('image')) {
    cb(null, true);
  }

  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    //@ts-ignore
    cb(new AppError('not an image pls upload only Image', 400), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const resizeUserPhoto = async (req: Request, _: unknown, next: NextFunction): Promise<unknown> => {
  if (process.env.NODE_ENV === 'production') {
    return next();
  }
  if (!req.file) return next();

  //@ts-ignore
  req.file.filename = `user-${req.user!.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(Number(process.env.WIDTH_USER_PROFILE), Number(process.env.HEIGHT_USER_PROFILE))
    .toFormat(process.env.FORMAT_USER_PROFILE as keyof sharp.FormatEnum)
    .jpeg({ quality: Number(process.env.QUALITY_USER_PROFILE) })
    .toFile(`public/images/users/${req.file.filename}`);

  next();
};
