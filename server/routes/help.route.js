import { Router } from 'express';
import { handleHelp } from '../controllers/helpController.js';

const helpRouter = Router();

helpRouter.get(
    '/help',
    handleHelp
);

export {helpRouter}