import { Router } from 'express';
import { handlePassport } from '../controllers/passportController.js';
import { handleIsolateReagent, handleDeleteReagent, handleGetReagents, handleAddReagent, handleTakeReagent, handleGetOneReagent, handleAddManyReagents, handleChangeReagent, handleIsolate,   } from '../controllers/reagentController.js';
import { handleFavorite, handleUnfavorite } from '../controllers/favoriteController.js';

const reagentRouter = Router();

reagentRouter.patch(
    '/isolate/:target/',
   handleIsolateReagent
);



reagentRouter.delete(
    '/delete/:target/',
    handleDeleteReagent
)

reagentRouter.get(
    '/getAll/:type/:isolate',
    handleGetReagents
)

reagentRouter.get(
    '/getOne/:target',
    handleGetOneReagent
)

reagentRouter.post(
    '/createOne/',
    handleAddReagent
)

reagentRouter.put(
    '/take/:target/',
    handleTakeReagent
)

reagentRouter.patch(
    '/favorite/:target/',
    handleFavorite
)

reagentRouter.patch(
    '/unfavorite/:target/',
    handleUnfavorite
)

reagentRouter.post(
    '/addMany/',
    handleIsolate
)

reagentRouter.patch(
    '/change/:target/',
    handleChangeReagent
)

reagentRouter.get(
    '/getPassport/:target/',
    handlePassport
)




export {reagentRouter}