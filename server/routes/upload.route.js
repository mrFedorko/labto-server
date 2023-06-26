import { Router } from "express"; 
import { handleUploadCol } from "../controllers/uploadColController.js";

import { handleUpload } from "../controllers/uploadController.js";
import { handleUploadEqCert, handleUploadEqManual, handleUploadEqPassport } from "../controllers/uploadEqController.js";
import { uploadEquipmentCertMW, uploadEquipmentManualMW, uploadEquipmentPassportMW, uploadMW } from "../middleware/upload.js";


const uploadRouter = Router();

uploadRouter.patch('/upload/:itemId', uploadMW.single('files'), handleUpload);
uploadRouter.patch('/uploadCol/:itemId', uploadMW.single('files'), handleUploadCol);
uploadRouter.patch('/uploadEquipment/passport/:itemId', uploadEquipmentPassportMW.single('files'), handleUploadEqPassport);
uploadRouter.patch('/uploadEquipment/manual/:itemId', uploadEquipmentManualMW.single('files'), handleUploadEqManual);
uploadRouter.patch('/uploadEquipment/cert/:itemId', uploadEquipmentCertMW.single('files'), handleUploadEqCert);


export {uploadRouter};