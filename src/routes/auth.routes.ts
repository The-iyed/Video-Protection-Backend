import { Router } from 'express';
import { googleLogin, login, resetPassword, signup } from '../controllers/authContoler';
import { forgetPassword } from '../controllers/authContoler';
import {
  getMe,
  getUser,
  updateUser,
  uploadImgToCloudinary,
  uploadUserPhoto,
} from '../controllers/userControler';
import { protect } from '../services/auth.service';
import { resizeUserPhoto } from '../services/user.service';
import { endPoint } from './endpoint';

const route = Router();

const {
  forgetPasswordEndPoint,
  signupEndPoint,
  resetPasswordEndPoint,
  loginEndPoint,

  updateMeEndPoint,
  authGoogleLoginEndPoint,
  getMeEndPoint,
} = endPoint;

route.route(forgetPasswordEndPoint).post(forgetPassword);
route.post(signupEndPoint, signup);
route.patch(resetPasswordEndPoint, resetPassword);
route.post(loginEndPoint, login);

route.patch(
  updateMeEndPoint,
  protect,
  uploadUserPhoto,
  resizeUserPhoto,
  uploadImgToCloudinary,
  getMe,
  updateUser
);
route.post(authGoogleLoginEndPoint, googleLogin);
route.get(getMeEndPoint, protect, getMe, getUser);

export default route;
