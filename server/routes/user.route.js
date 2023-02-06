import { Router } from 'express';
import { handleGetUsers } from '../controllers/optionsController.js';
import { handleAddUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get(
    '/getAll/',
   handleGetUsers
);
userRouter.post(
    '/create/',
   handleAddUser
);


export {userRouter}