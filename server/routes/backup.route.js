import { Router } from "express"; 
import { handleBackup, handleDeleteBackup, handleDownloadBackup, handleGetBackupNames, handleRestore } from "../controllers/backUpController.js";


const backupRouter = Router();

backupRouter.post('/backup', handleBackup);
backupRouter.post('/restore', handleRestore);
backupRouter.get('/backups/getall', handleGetBackupNames);
backupRouter.post('/backups/download', handleDownloadBackup);
backupRouter.delete('/backups/delete', handleDeleteBackup);




export {backupRouter};