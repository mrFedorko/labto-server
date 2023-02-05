import { Router } from 'express';
import { handleAddOption, handleDeleteOption, handleGetOptions } from '../controllers/optionsController.js';

const optionRouter = Router();

optionRouter.get(
    '/getAll/',
   handleGetOptions
);

optionRouter.patch(
    '/addOne/',
   handleAddOption
);

optionRouter.get(
    '/deleteOne/',
   handleDeleteOption
);




export {optionRouter}