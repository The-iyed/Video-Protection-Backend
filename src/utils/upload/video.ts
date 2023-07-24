import { FileFilterCallback } from 'multer';
import { AppError } from '../appError';
import { HttpCode } from '../httpCode';
import { Request } from 'express';
export const filterVideo = (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.endsWith('mp4')) {
    cb(null, true);
  } else {
    const error = new AppError(
      'Not an image. Please upload only images. or audio',
      HttpCode.BAD_REQUEST
    ) as AppError | null;
    cb(error as null, false);
  }
};
