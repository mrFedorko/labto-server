import { Router } from "express"; 
import { handleIsStart, handleStart } from "../controllers/startController.js";
import { limiterMW } from "../middleware/rateLimit.js";


const startRouter = Router();

startRouter.get(
    '/isStart',
    limiterMW,
    handleIsStart
);
startRouter.post(
    '/startApp',
    handleStart
);


export {startRouter};