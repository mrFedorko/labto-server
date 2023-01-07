import { Router } from "express"; 
import { handleNewUser } from '../controllers/registerController.js';
import { check } from "express-validator";

const registerRouter = Router();

registerRouter.post('/',  handleNewUser);

export {registerRouter};