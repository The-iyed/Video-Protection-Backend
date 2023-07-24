import { Schema, model, ObjectId, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

import validator from 'validator';
export interface User {
  _id?: ObjectId;
  username?: string;
  email: string;
  password: string;
  role?: string;
  passwordChangeAt?: Date | number;
  confirmPassword?: string;
  photo?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date | number;
  phoneNumber?: string;
}

export const schema: Schema = new Schema<User>(
  {
    username: {
      type: String,
      required: [true, 'The username is required'],
      minlength: [3, 'Firstname length must be less then or equal to 3 chars'],
      maxlength: [253, 'Firstname length must be greater then or equal to 25 chars'],
    },

    email: {
      type: String,
      required: [true, 'the email is required !'],
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'the password is required'],
      select: false,
    },

    confirmPassword: {
      type: String,
      required: [true, 'the confirmPassword is required'],
      validate: {
        validator: function (val: string): boolean {
          //@ts-ignore
          return this.password == val;
        },
        message: 'the confirmPassword does not match the password',
      },
    },

    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phoneNumber: {
      type: String,
      required: [true, 'phoneNumber is required'],
      unique: [true, 'this phone number is already in use'],
      validate: {
        validator: function (value: string) {
          return validator.isMobilePhone(value, 'ar-TN', { strictMode: true });
        },
        message: 'the phone number is not valid or it not from tunisia',
      },
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, +process.env.PASSWORD_SALT!);
  this.confirmPassword = undefined;
  next();
});
schema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.updatedAt = Date.now() - 1000;
  next();
});

schema.plugin(paginate);

export const User: PaginateModel<User> = model<User, PaginateModel<User>>('User', schema);
