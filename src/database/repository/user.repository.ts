import { dataUpdated, userSingUp } from '../../interface/user';
import { cleanObject, objectFilter } from '../../utils/objUtil';
import { User } from '../models/user';

export default interface opationAll {
  id?: string;
  page?: number | string;
  limit?: number;
  pageSize?: number;
  select?: string;
  sort?: string;
  projection?: string;
  role?: string;
  filter?: object;
  populate?: object;
}

export const getAll = async ({
  page,
  pageSize,
  select,
  sort,
  filter,
}: opationAll) => {
  const options: opationAll = {
    page: +page! || 1,
    limit: +pageSize! || 10,
    projection: select,
    sort: sort,
  };
  const filtereOption = cleanObject(options);

  return await User.paginate(filter || {}, filtereOption);
};

export const getOne = async (id: string) => {
  const user = await User.findById(id).select('-__v');
  return user;
};

export const updateOne = async (id: string, info: objectFilter) => {
  const dataUpdated: dataUpdated = cleanObject(
    objectFilter(info, 'username', 'email')
  );

  if (info.file) {
    //@ts-ignore
    dataUpdated.photo = info.file?.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(id, dataUpdated, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

export const createOne = async (userInfo: userSingUp) => {
  return await User.create(userInfo);
};
