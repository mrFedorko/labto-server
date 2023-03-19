import { Router } from "express"; 
import { handlegeIsService, handlegeStartService, handlegeStopService } from "../controllers/settingsController.js";


const settingsRouter = Router();

settingsRouter.get(
    '/isService',
    handlegeIsService
);
settingsRouter.patch(
    '/startService',
    handlegeStartService
);
settingsRouter.patch(
    '/stopService',
    handlegeStopService
);


export {settingsRouter};