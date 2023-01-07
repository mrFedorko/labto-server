import { Router } from "express"; 
import { handleLogin } from "../controllers/authController.js"; 


const authRouter = Router();

authRouter.post('/', handleLogin);

export {authRouter};