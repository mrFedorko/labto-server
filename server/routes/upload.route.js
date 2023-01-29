import { Router } from "express"; 
import { handleLogin } from "../controllers/authController.js"; 
import { handleUpload } from "../controllers/uploadController.js";
import { uploadMW } from "../middleware/upload.js";


const uploadRouter = Router();

uploadRouter.patch('/upload/:userId/:itemId', uploadMW.single('files'), handleUpload)

export {uploadRouter};