import { Router } from 'express';
import { handleGetHistory, handleGetUserHistory } from '../controllers/historyController.js';

const historyRouter = Router();

historyRouter.get(
    '/get/',
   handleGetHistory
);

historyRouter.get(
    '/getUser/:target',
    handleGetUserHistory
)



export {historyRouter}