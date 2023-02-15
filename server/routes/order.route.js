import { Router } from 'express';
import { handleDeleteOrder, handleGetMyOrders, handleGetOrders, handleMessageOrder, handleNewOrder, handleStatusOrder } from '../controllers/orderController.js';

const orderRouter = Router();

orderRouter.post( ///done
    '/create/',
    handleNewOrder
);
orderRouter.patch( ///done
    '/status/:target/:status/',
    handleStatusOrder
);
orderRouter.delete( ///done
    '/delete/:target/',
    handleDeleteOrder
);
orderRouter.put( ///done
    '/message/:target/',
    handleMessageOrder
);
orderRouter.get(
    '/getMy/',
    handleGetMyOrders
);
orderRouter.get(
    '/getAll/:status/',
    handleGetOrders
);


export {orderRouter}