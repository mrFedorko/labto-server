import { handleCreateProjectReport } from "../controllers/reportController.js";
import { Router } from "express";

const reportRouter = Router();

reportRouter.get(
    '/project/',
   handleCreateProjectReport
);




export {reportRouter}