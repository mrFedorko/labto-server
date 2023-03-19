import { handleCreateDirectionReport, handleCreateProjectReport } from "../controllers/reportController.js";
import { Router } from "express";

const reportRouter = Router();

reportRouter.post(
    '/project/',
   handleCreateProjectReport
);
reportRouter.post(
    '/direction/',
   handleCreateDirectionReport
);




export {reportRouter}