import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

export const generateAcessToken = (id: ObjectId) => {
  return jwt.sign(
    {
      id,
    },
    process.env.ACCESS_JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_ACCES_EXPIRES_TIME,
    }
  );
};
export const passwordHashing = async (password: string): Promise<string> => {
  const result = await bcrypt.hash(password, +process.env.PASSWORD_SALT!);
  return result;
};

export const comparePassword = async (currPass: string, userPass: string): Promise<boolean> => {
  const test = await bcrypt.compare(currPass, userPass);
  return test;
};
