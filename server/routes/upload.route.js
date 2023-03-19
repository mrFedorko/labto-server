import { Router } from "express"; 
import { handleUploadCol } from "../controllers/uploadColController.js";

import { handleUpload } from "../controllers/uploadController.js";
import { uploadMW } from "../middleware/upload.js";


const uploadRouter = Router();

uploadRouter.patch('/upload/:itemId', uploadMW.single('files'), handleUpload);
uploadRouter.patch('/uploadCol/:itemId', uploadMW.single('files'), handleUploadCol);

export {uploadRouter};