import { Router } from 'express';
import { handleGetOrders, handleNewOrder } from '../controllers/orderController.js';

const newOrderRouter = Router();

newOrderRouter.get(
    '/getall/:id',
    handleGetOrders
);
newOrderRouter.post(
    '/create',
    handleNewOrder
);

export {newOrderRouter}