import { Router } from 'express';
import { handleGetMessages } from '../controllers/chatController.js';

const chatMessageRouter = Router();

chatMessageRouter.get(
    '/getall/:id',
    handleGetMessages
);

export {chatMessageRouter}