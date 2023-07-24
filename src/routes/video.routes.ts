import { Router } from "express";
import { upload, uploadVideoToFS } from "../utils/upload";
import { endPoint } from "./endpoint";


const route = Router()

route.post(endPoint.baseEndPoint, upload, uploadVideoToFS);

export default route