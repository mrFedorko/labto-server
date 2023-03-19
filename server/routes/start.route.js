import { Router } from "express"; 
import { handleStartIsService } from "../controllers/startController.js";


const startRouter = Router();

startRouter.get(
    '/isService',
    handleStartIsService
);


export {startRouter};