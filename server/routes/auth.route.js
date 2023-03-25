import { Router } from "express"; 
import { handleLogin } from "../controllers/authController.js"; 
import { limiterMW } from "../middleware/rateLimit.js";


const authRouter = Router();

authRouter.post('/', limiterMW, handleLogin);


export {authRouter};