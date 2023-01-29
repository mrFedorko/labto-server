import { Router } from 'express';
import { handleGetUsers } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get(
    '/getAll/',
   handleGetUsers
);


export {userRouter}