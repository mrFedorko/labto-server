import { Router } from 'express';
import { handleGetUsers } from '../controllers/optionsController.js';

const userRouter = Router();

userRouter.get(
    '/getAll/',
   handleGetUsers
);


export {userRouter}