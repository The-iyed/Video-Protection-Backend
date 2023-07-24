import { NextFunction, Response, Request } from 'express';
import AsyncHandler from 'express-async-handler';
import { getAllUsers, upload } from '../services/user.service';
import { getOne, updateOne } from '../database/repository/user.repository';
import { HttpCode } from '../utils/httpCode';
import cloudinary, { cloudinaryUserConfig } from '../utils/cloudinaryConfig';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { AppError } from '../utils/appError';
export const getAllUser = AsyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize, select, sort, ...filter } = req.query;
  const options = {
    page: +page!,
    pageSize: +pageSize!,
    select,
    sort,
    filter,
  };
  //@ts-ignore
  const allUser = await getAllUsers(options);
  res.status(HttpCode.OK).json({
    status: 'success',
    data: allUser,
  });
});

export const getUser = AsyncHandler(async (req: Request, res: Response) => {
  const user = await getOne(req.params.id);

  res.status(HttpCode.OK).json({
    status: 'success',
    data: user,
  });
});

export const updateUser = AsyncHandler(async (req: Request, res: Response) => {
  if (req.file) req.body.file = req.file;
  const updatedUser = await updateOne(req.params.id, req.body);
  res.status(HttpCode.OK).json({
    status: 'success',
    data: updatedUser,
  });
});

export const getMe = async (req: Request, _: unknown, next: NextFunction) => {
  //@ts-ignore
  req.params.id = req.user.id;
  next();
};

export const uploadUserPhoto = upload.single('photo');

export const uploadImgToCloudinary = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production' || !req.file) {
      return next();
    }
    const image = req.file.buffer;
    const uploadPromise = new Promise<void>((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        //@ts-ignore
        cloudinaryUserConfig(req.user._id),
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            reject(error);
            return new AppError(error.message, error.http_code);
          } else {
            //@ts-ignore
            req.file?.filename = result.url;
            resolve();
          }
        }
      );
      stream.write(image);
      stream.end();
    });
    await uploadPromise;
    next();
  }
);
