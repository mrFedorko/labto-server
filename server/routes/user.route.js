import { Router } from 'express';
import { handleGetUnactiveUsers, handleGetUsers } from '../controllers/optionsController.js';
import { handleActiveUser, handleAddUser, handleChangeCredentials, handleChangeRole, handleChangeUserData, handleDeleteUser, handleUnactiveUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get(
    '/getAll/',
   handleGetUsers
);
userRouter.get(
    '/getAllUnactive/',
   handleGetUnactiveUsers
);
userRouter.post(
    '/create/',
   handleAddUser
);
userRouter.patch(
    '/chCr/:target',
   handleChangeCredentials
);
userRouter.patch(
    '/chRl/:target',
   handleChangeRole
);
userRouter.patch(
    '/chUD/:target',
   handleChangeUserData
);
userRouter.patch(
    '/unactive/:target',
   handleUnactiveUser
);
userRouter.patch(
    '/active/:target',
   handleActiveUser
);
userRouter.delete(
    '/deleteOne/:target',
   handleDeleteUser
);


export {userRouter}