import { Router } from 'express';
import { handleArchiveOrder, handleDeleteOrder, handleGetMyOrders, handleGetOrders, handleMessageOrder, handleNewOrder, handleRedirectOrder, handleStatusOrder } from '../controllers/orderController.js';

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
    '/getAll/:reqStatus/',
    handleGetOrders
);
orderRouter.patch(
    '/redirect/:targetUser/:target',
    handleRedirectOrder
);
orderRouter.patch(
    '/archive/:target',
    handleArchiveOrder
);


export {orderRouter}