import { Router } from 'express';
import { getAllUser, getUser, updateUser } from '../controllers/userControler';
import { protect, restrictTo } from '../services/auth.service';
import { endPoint } from './endpoint';
const route = Router();
route.route(endPoint.baseEndPoint).get(
  protect,
  //@ts-ignore
  restrictTo('admin'),
  getAllUser
);

route.route(endPoint.identityEndPoint).get(getUser).patch(updateUser);

export default route;
