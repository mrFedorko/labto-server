import { Router } from 'express';
import { handleGetSettings, handleSetSettings } from '../controllers/settingsController.js';

const settingsRouter = Router();

settingsRouter.get(
    '/get/:id',
    handleGetSettings
);
settingsRouter.post(
    '/set/:id',
    handleSetSettings
);

export {settingsRouter}